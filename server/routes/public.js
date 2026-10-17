
const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const Announcement = require('../models/Announcement');
const Team = require('../models/Team');

// @desc    Get Live Matches
// @route   GET /api/public/matches/live
router.get('/matches/live', async (req, res) => {
    const matches = await Match.find({ status: 'live' })
        .populate('teamA', 'name')
        .populate('teamB', 'name')
        .populate('tournament', 'name sport');
    res.json(matches);
});

// @desc    Get Matches by Status (upcoming, results) or Tournament
// @route   GET /api/public/matches
router.get('/matches', async (req, res) => {
    const { status, tournament } = req.query;
    let query = {};
    if (status) query.status = status;
    if (tournament) query.tournament = tournament;

    const matches = await Match.find(query)
        .populate('teamA', 'name')
        .populate('teamB', 'name')
        .sort({ date: 1 });
    res.json(matches);
});

// @desc    Get Announcements
// @route   GET /api/public/announcements
router.get('/announcements', async (req, res) => {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
});

// @desc    Get Tournaments (Brackets/Schedule selection)
// @route   GET /api/public/tournaments
router.get('/tournaments', async (req, res) => {
    const tournaments = await Tournament.find({});
    res.json(tournaments);
});

module.exports = router;
