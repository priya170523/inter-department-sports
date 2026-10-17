const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new team (Captain only)
// @route   POST /api/teams
router.post('/', protect, async (req, res) => {
    try {
        const { name } = req.body;
        const captainId = req.user._id;
        const department = req.user.department;

        // Check if team for this department already exists
        const existingTeam = await Team.findOne({ department });
        if (existingTeam) {
            return res.status(400).json({ message: `A team for ${department} already exists.` });
        }

        // Check if this captain already has a team (though one-to-one with dept implies this)
        const captainTeam = await Team.findOne({ captain: captainId });
        if (captainTeam) {
            return res.status(400).json({ message: 'You have already created a team.' });
        }

        const team = await Team.create({
            name,
            captain: captainId,
            department: department
        });

        res.status(201).json(team);
    } catch (error) {
        console.error("Create Team Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get my team details
// @route   GET /api/teams/my-team
router.get('/my-team', protect, async (req, res) => {
    try {
        const team = await Team.findOne({ captain: req.user._id });
        if (!team) {
            return res.status(404).json({ message: 'No team found for this captain.' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add/Update Players
// @route   PUT /api/teams/players
router.put('/players', protect, async (req, res) => {
    try {
        const { members } = req.body; // Expecting array of { name, registrationNumber }

        const team = await Team.findOne({ captain: req.user._id });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.members = members;
        await team.save();

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
