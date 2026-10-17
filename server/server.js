
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
console.log('Auth Routes Loaded:', typeof authRoutes, authRoutes.stack ? 'Has Stack' : 'No Stack');
if (authRoutes.stack) {
    authRoutes.stack.forEach(r => {
        if (r.route && r.route.path) {
            console.log('Route:', r.route.path);
        }
    });
}
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

app.get('/api/auth/test', (req, res) => {
    res.send('Inline Test OK');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const teamRoutes = require('./routes/teams');
app.use('/api/teams', teamRoutes);

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sports-db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
