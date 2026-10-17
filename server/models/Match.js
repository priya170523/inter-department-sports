
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    date: { type: Date },
    venue: { type: String },
    status: { type: String, enum: ['scheduled', 'toss', 'live', 'completed', 'postponed'], default: 'scheduled' },

    // Toss Info
    toss: {
        winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        decision: { type: String, enum: ['bat', 'field'] }
    },

    // Detailed Stats (Schema w/ flexibility for Cricbuzz style)
    currentInning: { type: Number, default: 1 }, // 1 or 2

    // Live State (Snapshot)
    liveState: {
        battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0.0 }, // 1.1, 1.2 etc
        striker: { type: String }, // Player Name
        nonStriker: { type: String }, // Player Name
        bowler: { type: String }, // Player Name
        recentBalls: [{ type: String }] // Array of strings like "1", "4", "W", "0"
    },

    // Full History (For Replay/Stats)
    innings: [{
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: [{
            number: Number,
            bowler: String,
            balls: [{
                ballNumber: Number,
                batter: String,
                runs: Number,
                isBoundary: Boolean,
                isSix: Boolean,
                extras: { type: String, enum: [null, 'wide', 'no-ball', 'bye', 'leg-bye'] },
                isWicket: Boolean,
                dismissalType: String
            }]
        }]
    }],

    score: {
        teamA: { type: Number, default: 0 },
        teamB: { type: Number, default: 0 }
    },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    highlights: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
