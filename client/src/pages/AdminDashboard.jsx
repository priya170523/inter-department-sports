import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NeuCard from '../components/ui/NeuCard';
import NeuButton from '../components/ui/NeuButton';
import NeuInput from '../components/ui/NeuInput';
import { apiRequest } from '../utils/api';
import { Check, X, Calendar, Megaphone, Users, Trophy, PlayCircle, Edit3 } from 'lucide-react';

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showTournamentModal, setShowTournamentModal] = useState(false);
    const [showAnnounceModal, setShowAnnounceModal] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

    // Data
    const [tournamentData, setTournamentData] = useState({
        name: '',
        type: 'League',
        sport: 'Cricket',
        startDate: '',
        endDate: '',
        teams: []
    });
    const [announceData, setAnnounceData] = useState({ title: '', content: '' });
    const [scoreData, setScoreData] = useState({ matchId: '', scoreA: '', scoreB: '' });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const teamsData = await apiRequest('/admin/teams', 'GET', null, token);
            // Assuming we have a public or admin route for matches, let's use public for list or create an admin one.
            // Using public for now as admin.js didn't show a GET /matches
            const matchesData = await apiRequest('/public/matches', 'GET');

            setTeams(teamsData);
            setMatches(matchesData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTeamStatus = async (id, status) => {
        if (status === 'rejected' && !window.confirm('Are you sure? This will delete the team.')) return;
        try {
            const token = localStorage.getItem('token');
            await apiRequest(`/admin/teams/${id}/status`, 'PUT', { status }, token);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        if (tournamentData.teams.length < 2) return alert('Select at least 2 teams');

        try {
            const token = localStorage.getItem('token');
            await apiRequest('/admin/tournaments', 'POST', tournamentData, token);
            setShowTournamentModal(false);
            alert('Tournament Created & Matches Scheduled!');
            setTournamentData({ name: '', type: 'League', sport: 'Cricket', startDate: '', endDate: '', teams: [] });
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await apiRequest('/admin/announcements', 'POST', announceData, token);
            setShowAnnounceModal(false);
            alert('Announcement Posted');
            setAnnounceData({ title: '', content: '' });
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUpdateScore = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await apiRequest(`/admin/matches/${scoreData.matchId}`, 'PUT', {
                score: { teamA: scoreData.scoreA, teamB: scoreData.scoreB },
                status: 'completed'
            }, token);
            setShowScoreModal(false);
            setScoreData({ matchId: '', scoreA: '', scoreB: '' });
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const toggleTeamSelection = (id) => {
        setTournamentData(prev => {
            const teams = prev.teams.includes(id)
                ? prev.teams.filter(t => t !== id)
                : [...prev.teams, id];
            return { ...prev, teams };
        });
    };

    const approvedTeams = teams.filter(t => t.status === 'approved');
    const pendingTeams = teams.filter(t => t.status === 'pending');

    if (loading) return <div className="text-center mt-20 text-gray-400">Loading Admin Panel...</div>;

    return (
        <div className="space-y-8 pb-20">
            <h1 className="text-3xl font-bold text-gray-100">Admin Dashboard</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <NeuCard>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-full text-blue-500"><Users size={24} /></div>
                        <div>
                            <p className="text-2xl font-bold text-gray-100">{teams.length}</p>
                            <p className="text-sm text-gray-500">Total Teams</p>
                        </div>
                    </div>
                </NeuCard>
                <NeuCard>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-500"><Calendar size={24} /></div>
                        <div>
                            <p className="text-2xl font-bold text-gray-100">{matches.filter(m => m.status === 'scheduled').length}</p>
                            <p className="text-sm text-gray-500">Scheduled Matches</p>
                        </div>
                    </div>
                </NeuCard>

                {/* Actions */}
                <NeuCard className="lg:col-span-1 space-y-3">
                    <h3 className="font-bold text-gray-200">Quick Actions</h3>
                    <NeuButton onClick={() => setShowTournamentModal(true)} className="w-full text-sm">Create Tournament</NeuButton>
                    <NeuButton onClick={() => setShowAnnounceModal(true)} className="w-full text-sm">Post Update</NeuButton>
                </NeuCard>
            </div>

            {/* Pending Teams Section */}
            {pendingTeams.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-200">Pending Approvals</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {pendingTeams.map(team => (
                            <NeuCard key={team._id} className="flex justify-between items-center bg-yellow-500/5 border-yellow-500/20">
                                <div>
                                    <h3 className="font-bold text-gray-100">{team.name}</h3>
                                    <p className="text-sm text-gray-400">{team.department} • {team.captain?.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleTeamStatus(team._id, 'approved')} className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30">
                                        <Check size={18} />
                                    </button>
                                    <button onClick={() => handleTeamStatus(team._id, 'rejected')} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30">
                                        <X size={18} />
                                    </button>
                                </div>
                            </NeuCard>
                        ))}
                    </div>
                </div>
            )}

            {/* Matches Management */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-200">Manage Matches</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {matches.map(match => (
                        <NeuCard key={match._id} className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-accent mb-1">{new Date(match.date).toDateString()} • {match.venue}</p>
                                <h3 className="font-bold text-gray-100">{match.teamA?.name} vs {match.teamB?.name}</h3>
                                <p className="text-sm text-gray-400">Status: {match.status}</p>
                                {match.status === 'completed' && (
                                    <p className="text-sm font-mono text-gray-300">Score: {match.score?.teamA} - {match.score?.teamB}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    to={`/admin/match/${match._id}/score`}
                                    className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 text-blue-400"
                                    title="Live Scoring"
                                >
                                    <PlayCircle size={20} />
                                </Link>
                            </div>
                        </NeuCard>
                    ))}
                    {matches.length === 0 && <p className="text-gray-500">No matches scheduled.</p>}
                </div>
            </div>

            {/* Approved Teams List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-200">Registered Teams</h2>
                <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 font-bold uppercase">
                            <tr>
                                <th className="p-4">Team</th>
                                <th className="p-4">Dept</th>
                                <th className="p-4">Captain</th>
                                <th className="p-4 text-center">Players</th>
                                <th className="p-4 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {approvedTeams.map(team => (
                                <tr key={team._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-gray-200">{team.name}</td>
                                    <td className="p-4">{team.department}</td>
                                    <td className="p-4">{team.captain?.name || 'Unknown'}</td>
                                    <td className="p-4 text-center">{team.members.length}</td>
                                    <td className="p-4 text-right font-mono text-accent">{team.stats.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Tournament Modal */}
            {showTournamentModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <NeuCard className="w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-100">Create Tournament</h3>
                        <form onSubmit={handleCreateTournament} className="space-y-4">
                            <NeuInput placeholder="Tournament Name" value={tournamentData.name} onChange={e => setTournamentData({ ...tournamentData, name: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 ml-1">Type</label>
                                    <select className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none" value={tournamentData.type} onChange={e => setTournamentData({ ...tournamentData, type: e.target.value })}>
                                        <option value="League">League</option>
                                        <option value="Knockout">Knockout</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 ml-1">Sport</label>
                                    <select className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none" value={tournamentData.sport} onChange={e => setTournamentData({ ...tournamentData, sport: e.target.value })}>
                                        <option value="Cricket">Cricket</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <NeuInput type="date" value={tournamentData.startDate} onChange={e => setTournamentData({ ...tournamentData, startDate: e.target.value })} required />
                                <NeuInput type="date" value={tournamentData.endDate} onChange={e => setTournamentData({ ...tournamentData, endDate: e.target.value })} required />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-300 mb-2 block">Select Teams</label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-xl">
                                    {approvedTeams.map(t => (
                                        <label key={t._id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={tournamentData.teams.includes(t._id)}
                                                onChange={() => toggleTeamSelection(t._id)}
                                                className="rounded border-gray-600 bg-background text-accent focus:ring-accent"
                                            />
                                            <span className="text-sm text-gray-200">{t.name} ({t.department})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <NeuButton type="submit" className="flex-1">Create & Schedule</NeuButton>
                                <button type="button" onClick={() => setShowTournamentModal(false)} className="px-4 text-gray-500">Cancel</button>
                            </div>
                        </form>
                    </NeuCard>
                </div>
            )}

            {/* Score Modal */}
            {showScoreModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <NeuCard className="w-full max-w-sm space-y-4">
                        <h3 className="text-xl font-bold text-gray-100">Update Score</h3>
                        <form onSubmit={handleUpdateScore} className="space-y-4">
                            <div className="flex gap-4 items-center justify-center">
                                <NeuInput type="number" placeholder="Team A" value={scoreData.scoreA} onChange={e => setScoreData({ ...scoreData, scoreA: e.target.value })} required />
                                <span className="text-gray-500 font-bold">-</span>
                                <NeuInput type="number" placeholder="Team B" value={scoreData.scoreB} onChange={e => setScoreData({ ...scoreData, scoreB: e.target.value })} required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <NeuButton type="submit" className="flex-1">Update Score</NeuButton>
                                <button type="button" onClick={() => setShowScoreModal(false)} className="px-4 text-gray-500">Cancel</button>
                            </div>
                        </form>
                    </NeuCard>
                </div>
            )}

            {/* Announcement Modal */}
            {showAnnounceModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <NeuCard className="w-full max-w-lg space-y-4">
                        <h3 className="text-xl font-bold text-gray-100">New Announcement</h3>
                        <form onSubmit={handlePostAnnouncement} className="space-y-4">
                            <NeuInput placeholder="Title" value={announceData.title} onChange={e => setAnnounceData({ ...announceData, title: e.target.value })} required />
                            <textarea className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-gray-100 outline-none h-32 resize-none" placeholder="Content..." value={announceData.content} onChange={e => setAnnounceData({ ...announceData, content: e.target.value })} required></textarea>
                            <div className="flex gap-3 pt-2">
                                <NeuButton type="submit" className="flex-1">Post</NeuButton>
                                <button type="button" onClick={() => setShowAnnounceModal(false)} className="px-4 text-gray-500">Cancel</button>
                            </div>
                        </form>
                    </NeuCard>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
