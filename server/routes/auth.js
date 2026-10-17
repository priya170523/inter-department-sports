
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new captain
// @route   POST /api/auth/register
// @access  Public
router.get('/test', (req, res) => {
    res.send('Auth Test OK');
});

router.post('/register', async (req, res) => {
    try {
        console.log('Register route hit. Body:', req.body);

        const { name, email, password, registrationNumber, department, phone, sport } = req.body;

        if (!sport) {
            return res.status(400).json({ message: 'Sport selection is required' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if Team for department AND sport exists
        const teamExists = await Team.findOne({ department, sport });
        if (teamExists) {
            return res.status(400).json({ message: `A ${sport} team for ${department} already exists.` });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            registrationNumber,
            department,
            phone,
            role: 'captain'
        });

        if (user) {
            // Auto-create Team for basic registration
            const newTeam = await Team.create({
                name: `${department} ${sport} Team`,
                captain: user._id,
                department: department,
                sport: sport,
                status: 'pending',
                members: []
            });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                teamId: newTeam._id
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for admin login (Environment variables)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            return res.json({
                _id: '000000000000000000000000',
                name: 'Administrator',
                email: email,
                role: 'admin',
                token: generateToken('000000000000000000000000')
            });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', require('../middleware/authMiddleware').protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;
