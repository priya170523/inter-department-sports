
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sport: { type: String, required: true },
    type: { type: String, enum: ['League', 'Knockout'], required: true }, // League = Round Robin
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    rounds: { type: Number, default: 1 }, // For league: 1 or 2 (home/away)
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
