
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['general', 'alert', 'result'], default: 'general' },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
