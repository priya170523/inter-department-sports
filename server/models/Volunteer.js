
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    department: { type: String, required: true },
    role: { type: String, enum: ['Coordinator', 'Referee', 'Media', 'Logistics'], required: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
