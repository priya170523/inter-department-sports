
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: {
        type: String,
        required: true,
        enum: ['CSE', 'IT', 'MECH', 'CIVIL', 'ECE', 'EEE', 'CSDIT']
    },
    sport: {
        type: String,
        required: true,
        enum: ['Cricket', 'Kabaddi', 'Badminton', 'Volleyball', 'Pickleball', 'Football', 'Chess', 'Carroms', 'Table Tennis', 'Basketball']
    }, // One team per sport per dept
    members: [{
        name: { type: String, required: true },
        registrationNumber: { type: String, required: true }
    }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    stats: {
        played: { type: Number, default: 0 },
        won: { type: Number, default: 0 },
        lost: { type: Number, default: 0 },
        draw: { type: Number, default: 0 },
        points: { type: Number, default: 0 }
    }
}, { timestamps: true });

teamSchema.index({ department: 1, sport: 1 }, { unique: true });

module.exports = mongoose.model('Team', teamSchema);
