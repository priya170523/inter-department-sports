
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NeuCard from '../components/ui/NeuCard';
import NeuButton from '../components/ui/NeuButton';
import NeuInput from '../components/ui/NeuInput';
import { apiRequest } from '../utils/api';
import { User, Plus, Trash2 } from 'lucide-react';

const CaptainDashboard = () => {
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [newPlayer, setNewPlayer] = useState({ name: '', registrationNumber: '' });

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const data = await apiRequest('/teams/my-team', 'GET', null, token);
                setTeam(data);
            } catch (error) {
                // If 404, it means captain hasn't created a team yet
                if (error.message.includes('404') || error.message.includes('found')) {
                    navigate('/create-team');
                } else {
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [navigate]);

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedMembers = [...team.members, newPlayer];
            const data = await apiRequest('/teams/players', 'PUT', { members: updatedMembers }, token);
            setTeam(data);
            setNewPlayer({ name: '', registrationNumber: '' });
            setShowAddPlayer(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRemovePlayer = async (index) => {
        if (!window.confirm('Are you sure you want to remove this player?')) return;
        try {
            const token = localStorage.getItem('token');
            const updatedMembers = team.members.filter((_, i) => i !== index);
            const data = await apiRequest('/teams/players', 'PUT', { members: updatedMembers }, token);
            setTeam(data);
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div className="text-center text-gray-400 mt-20">Loading Dashboard...</div>;
    if (!team) return null;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">{team.name}</h1>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary mt-2">
                        {team.department} Department
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className={`font-bold capitalize ${team.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {team.status}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Squad List */}
                <NeuCard className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl text-gray-100">Squad List</h3>
                        <span className="text-sm text-gray-500">{team.members.length} Players</span>
                    </div>

                    <div className="space-y-3">
                        {/* Captain (Hardcoded as first member usually, or we fetch user profile) */}
                        <div className="flex items-center justify-between p-3 bg-surface/50 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-200">Captain (You)</p>
                                    <p className="text-xs text-gray-500">Team Leader</p>
                                </div>
                            </div>
                        </div>

                        {team.members.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-surface/50 border border-white/5 rounded-xl group hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-200">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.registrationNumber}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemovePlayer(idx)}
                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {showAddPlayer ? (
                        <form onSubmit={handleAddPlayer} className="p-4 bg-surface border border-white/10 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4">
                            <h4 className="font-bold text-gray-300">Add New Player</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <NeuInput
                                    placeholder="Name"
                                    value={newPlayer.name}
                                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                    required
                                />
                                <NeuInput
                                    placeholder="Reg. Number"
                                    value={newPlayer.registrationNumber}
                                    onChange={(e) => setNewPlayer({ ...newPlayer, registrationNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <NeuButton type="submit" className="flex-1 bg-accent text-white">Add</NeuButton>
                                <button
                                    type="button"
                                    onClick={() => setShowAddPlayer(false)}
                                    className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <NeuButton onClick={() => setShowAddPlayer(true)} className="w-full flex items-center justify-center gap-2">
                            <Plus size={18} /> Add Player
                        </NeuButton>
                    )}
                </NeuCard>

                {/* Team Stats */}
                <NeuCard className="space-y-6">
                    <h3 className="font-bold text-xl text-gray-100">Team Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface border border-white/5 text-center">
                            <p className="text-3xl font-black text-white">{team.stats.points}</p>
                            <p className="text-sm text-gray-500">Points</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface border border-white/5 text-center">
                            <p className="text-3xl font-black text-gray-200">{team.stats.matchesPlayed || 0}</p>
                            <p className="text-sm text-gray-500">Matches Played</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                            <p className="text-3xl font-black text-green-500">{team.stats.won || 0}</p>
                            <p className="text-sm text-green-600/70">Won</p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                            <p className="text-3xl font-black text-red-500">{team.stats.lost || 0}</p>
                            <p className="text-sm text-red-600/70">Lost</p>
                        </div>
                    </div>
                </NeuCard>
            </div>
        </div>
    );
};
export default CaptainDashboard;
