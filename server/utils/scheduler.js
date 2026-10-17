
const Match = require('../models/Match');
const Team = require('../models/Team');

/**
 * Generate Fixtures for a Tournament
 * @param {Object} tournament - Tournament document
 * @param {Array} teams - List of team documents
 * @param {Object} config - { startDate, days, groundsCount, matchesPerDayPerGround }
 */
const generateFixtures = async (tournament, teams, config) => {
    const { startDate, days, groundsCount, matchesPerDayPerGround } = config;
    const fixtures = [];
    let currentDate = new Date(startDate);

    // Simple Round Robin Logic
    // Rotate array algorithm

    if (tournament.type === 'League') {
        const n = teams.length;
        const rounds = n % 2 === 0 ? n - 1 : n;
        const matchesPerRound = Math.floor(n / 2);

        let teamIds = teams.map(t => t._id);
        if (n % 2 !== 0) {
            teamIds.push(null); // Bye
        }

        const totalRounds = teamIds.length - 1;
        const matchesList = [];

        for (let r = 0; r < totalRounds; r++) {
            for (let i = 0; i < teamIds.length / 2; i++) {
                const t1 = teamIds[i];
                const t2 = teamIds[teamIds.length - 1 - i];

                if (t1 && t2) {
                    matchesList.push({ teamA: t1, teamB: t2, round: r + 1 });
                }
            }

            // Rotate
            teamIds.splice(1, 0, teamIds.pop());
        }

        // Assign Dates and Venues
        // Total slots per day = groundsCount * matchesPerDayPerGround
        let currentMatchIndex = 0;
        const totalMatches = matchesList.length;

        for (let d = 0; d < days; d++) {
            // For each day
            for (let g = 0; g < groundsCount; g++) {
                // For each ground
                for (let m = 0; m < matchesPerDayPerGround; m++) {
                    if (currentMatchIndex >= totalMatches) break;

                    const matchData = matchesList[currentMatchIndex];

                    // Create Match Object
                    // Time logic: Assume starting 9 AM + 1.5 hours per match
                    const matchTime = new Date(currentDate);
                    matchTime.setHours(9 + (m * 2), 0, 0);

                    fixtures.push({
                        tournament: tournament._id,
                        teamA: matchData.teamA,
                        teamB: matchData.teamB,
                        date: matchTime,
                        venue: `Ground ${g + 1}`,
                        status: 'scheduled'
                    });

                    currentMatchIndex++;
                }
            }
            // Next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else if (tournament.type === 'Knockout') {
        // Simple Single Elimination for Round 1
        // (Advanced tree management is needed for subsequent rounds, 
        // but initial fixtures can be genenerated for Round 1)

        // Shuffle teams
        const shuffled = [...teams].sort(() => 0.5 - Math.random());
        // Handle Byes if not power of 2
        // For MVP, just pair up adjacent

        let currentMatchIndex = 0;

        for (let i = 0; i < shuffled.length; i += 2) {
            if (i + 1 < shuffled.length) {
                // Pair
                // Time/Venue assignment (simplified same as above)
                const matchTime = new Date(startDate); // All round 1 on day 1 ideally?
                matchTime.setHours(9 + (currentMatchIndex * 2), 0, 0); // Serial

                fixtures.push({
                    tournament: tournament._id,
                    teamA: shuffled[i]._id,
                    teamB: shuffled[i + 1]._id,
                    date: matchTime,
                    venue: `Ground ${(currentMatchIndex % groundsCount) + 1}`,
                    status: 'scheduled'
                });
                currentMatchIndex++;
            }
        }
    }

    // Save to DB
    if (fixtures.length > 0) {
        await Match.insertMany(fixtures);
    }

    return fixtures;
};

module.exports = { generateFixtures };
