
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Match = require('../models/Match');
const Announcement = require('../models/Announcement');
const { generateFixtures } = require('../utils/scheduler');

// @desc    Create Tournament & Auto-Schedule
// @route   POST /api/admin/tournaments
router.post('/tournaments', protect, admin, async (req, res) => {
    try {
        const { name, sport, type, startDate, endDate, teams, timings } = req.body;

        // 1. Create Tournament
        const tournament = await Tournament.create({
            name,
            sport,
            type,
            startDate,
            endDate,
            teams, // Array of Team IDs
            status: 'upcoming'
        });

        // 2. Generate Fixtures
        if (teams && teams.length >= 2) {
            const teamDocs = await Team.find({ _id: { $in: teams } });

            // Config for scheduler
            const config = {
                startDate: startDate || new Date(),
                days: 10, // Default or calc from end date
                groundsCount: 4, // As per user requirement (Ground 1-4)
                matchesPerDayPerGround: 2
            };

            await generateFixtures(tournament, teamDocs, config);

            tournament.status = 'ongoing'; // Set to ongoing as matches are created
            await tournament.save();
        }

        // 3. Auto-Post Announcement
        await Announcement.create({
            title: `New Tournament: ${name}`,
            content: `The ${name} (${sport} - ${type}) has been announced! Matches start from ${new Date(startDate).toDateString()}. Check the schedule!`
        });

        res.status(201).json(tournament);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get All Teams (for approval) - UPDATE: Filter out valid teams? or show all
// @route   GET /api/admin/teams
router.get('/teams', protect, admin, async (req, res) => {
    const teams = await Team.find({}).populate('captain', 'name email');
    res.json(teams);
});

// @desc    Approve/Reject Team
// @route   PUT /api/admin/teams/:id/status
router.put('/teams/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;

        if (status === 'rejected') {
            await Team.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Team rejected and removed' });
        }

        const team = await Team.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update Toss Details
// @route   PUT /api/admin/matches/:id/toss
router.put('/matches/:id/toss', protect, admin, async (req, res) => {
    try {
        const { winnerId, decision, striker, nonStriker, bowler } = req.body;
        const match = await Match.findById(req.params.id);

        if (!match) return res.status(404).json({ message: 'Match not found' });

        // Update Toss
        match.toss = { winner: winnerId, decision };
        match.status = 'live';

        // Set Initial Live State
        const isTeamABatting = (match.teamA.toString() === winnerId && decision === 'bat') ||
            (match.teamB.toString() === winnerId && decision === 'field');

        match.liveState = {
            battingTeam: isTeamABatting ? match.teamA : match.teamB,
            bowlingTeam: isTeamABatting ? match.teamB : match.teamA,
            runs: 0,
            wickets: 0,
            overs: 0,
            striker: striker || 'Striker',
            nonStriker: nonStriker || 'Non-Striker',
            bowler: bowler || 'Bowler',
            recentBalls: []
        };

        // Initialize Innings Array
        match.innings = [{
            team: match.liveState.battingTeam,
            runs: 0,
            wickets: 0,
            overs: [{ number: 1, bowler: bowler || 'Bowler', balls: [] }] // Start Over 1
        }];

        await match.save();
        res.json(match);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update Ball (Scoring Engine)
// @route   PUT /api/admin/matches/:id/ball
router.put('/matches/:id/ball', protect, admin, async (req, res) => {
    try {
        const { runs, extras, isWicket, dismissalType, newBatter, newBowler } = req.body;
        const match = await Match.findById(req.params.id);

        if (!match) return res.status(404).json({ message: 'Match not found' });

        // Current State
        const currentInningIndex = match.innings.length - 1;
        const inning = match.innings[currentInningIndex];
        const currentOverIndex = inning.overs.length - 1;
        const over = inning.overs[currentOverIndex];

        // 1. Update Runs & Wickets
        let ballRuns = runs || 0;
        let totalRuns = ballRuns;

        // Extras logic
        if (extras === 'wide' || extras === 'no-ball') {
            totalRuns += 1; // 1 run for extra + runs scored
        }

        inning.runs += totalRuns;
        match.liveState.runs += totalRuns;
        match.liveState.recentBalls.push(isWicket ? 'W' : (totalRuns + (extras ? extras[0].toUpperCase() : '')));
        if (match.liveState.recentBalls.length > 6) match.liveState.recentBalls.shift();

        if (isWicket) {
            inning.wickets += 1;
            match.liveState.wickets += 1;
        }

        // 2. Add Ball to Over
        // Only valid balls count for over completion
        const isValidBall = (extras !== 'wide' && extras !== 'no-ball');

        over.balls.push({
            ballNumber: over.balls.length + 1,
            batter: match.liveState.striker,
            runs: ballRuns,
            extras: extras,
            isWicket,
            dismissalType
        });

        // 3. Strike Rotation (Standard Cricket)
        if (ballRuns % 2 !== 0) {
            // Swap
            const temp = match.liveState.striker;
            match.liveState.striker = match.liveState.nonStriker;
            match.liveState.nonStriker = temp;
        }

        if (isWicket && newBatter) {
            match.liveState.striker = newBatter; // New batter takes strike
        }

        // 4. Over Completion Check
        const validBallsCount = over.balls.filter(b => b.extras !== 'wide' && b.extras !== 'no-ball').length;

        if (validBallsCount >= 6) {
            // Rotate Strike at end of over
            const temp = match.liveState.striker;
            match.liveState.striker = match.liveState.nonStriker;
            match.liveState.nonStriker = temp;

            // Increment Over Count
            match.liveState.overs = Math.floor(match.liveState.overs) + 1;

            // Start New Over if not end of inning
            if (newBowler) {
                match.liveState.bowler = newBowler;
                inning.overs.push({ number: inning.overs.length + 1, bowler: newBowler, balls: [] });
            }
        } else {
            // Update fractional over (e.g. 0.1, 0.2)
            const overBase = Math.floor(match.liveState.overs);
            match.liveState.overs = overBase + (validBallsCount / 10);
        }

        // 5. Update Main Score (Compatibility for simple views)
        if (match.liveState.battingTeam.toString() === match.teamA.toString()) {
            match.score.teamA = match.liveState.runs;
        } else {
            match.score.teamB = match.liveState.runs;
        }

        await match.save();
        res.json(match);

    } catch (error) {
        res.status(400).json({ message: error.message });
        console.error(error);
    }
});

// @desc    Create Match Manually
// @route   POST /api/admin/matches
router.post('/matches', protect, admin, async (req, res) => {
    try {
        const { teamA, teamB, date, venue, sport } = req.body;

        // Simple validation
        if (!teamA || !teamB || !date || !venue) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const match = await Match.create({
            teamA,
            teamB,
            date,
            venue,
            sport: sport || 'General',
            status: 'scheduled'
        });

        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Post Announcement
// @route   POST /api/admin/announcements
router.post('/announcements', protect, admin, async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json(announcement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
