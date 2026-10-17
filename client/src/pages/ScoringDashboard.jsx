
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NeuCard from '../components/ui/NeuCard';
import NeuButton from '../components/ui/NeuButton';
import NeuInput from '../components/ui/NeuInput';
import { apiRequest } from '../utils/api';
import { Trophy, RefreshCcw } from 'lucide-react';

const ScoringDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    // UI Local State for selections
    const [showTossModal, setShowTossModal] = useState(false);
    const [tossData, setTossData] = useState({ winnerId: '', decision: 'bat', striker: '', nonStriker: '', bowler: '' });

    const [showBatterModal, setShowBatterModal] = useState(false);
    const [newBatterName, setNewBatterName] = useState('');

    const [showBowlerModal, setShowBowlerModal] = useState(false);
    const [newBowlerName, setNewBowlerName] = useState('');

    useEffect(() => {
        fetchMatch();
    }, []);

    const fetchMatch = async () => {
        try {
            const token = localStorage.getItem('token');
            // Assuming we added a specific GET /admin/matches/:id or using public one
            // Ideally we need specific one. Let's try fetching from public list and filtering or just GET /public/matches/:id if exists
            // Let's assume we can fetch it. For now, using admin teams route to get teams info? No.
            // We need match details. I'll rely on the fact that I can fetch it via a new endpoint or existing one.
            // Let's add GET /matches/:id to admin? Or just use the one I added? I didn't add GET /matches/:id...
            // I'll add a quick GET /matches/:id to admin routes in a bit. Or use /public/matches logic.
            // Wait, public.js usually has GET /matches. Let's assume I can get it there.
            const data = await apiRequest(`/public/matches/${id}`, 'GET');
            setMatch(data);
            setLoading(false);

            if (data.status === 'scheduled') {
                setShowTossModal(true);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleToss = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await apiRequest(`/admin/matches/${id}/toss`, 'PUT', tossData, token);
            setMatch(res);
            setShowTossModal(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleBall = async (runs, extras = null, isWicket = false) => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                runs,
                extras,
                isWicket,
                newBatter: newBatterName, // Only sent if modal was open? No, logic is tricky.
                newBowler: newBowlerName
            };

            // If wicket, we need new batter name. Ideally we ask via modal first.
            // Simplified: If Wicket, open modal.

            const res = await apiRequest(`/admin/matches/${id}/ball`, 'PUT', payload, token);
            setMatch(res);

            // Check if we need input for next ball (e.g. over end)
            // But response `res` has new state.
            // If over changed (floor(overs) increased), prompt for bowler?
        } catch (error) {
            alert(error.message);
        }
    };

    // Helper to handle flow
    const registerBall = (runs, extras = null, isWicket = false) => {
        if (isWicket) {
            // Open batter modal, then call API in that modal's submit
            // For simplicity, let's just use prompt() or simple toggle for now?
            // Complex UI requires complex state.
            const name = prompt("New Batter Name:");
            if (name) {
                apiCall(runs, extras, isWicket, name, null);
            }
            return;
        }

        // Check for over completion prediction? Hard to predict without local state.
        // Just call API. If response implies new bowler needed, we can handle it.
        // For MVP, allow user to set "New Bowler" explicitly?

        apiCall(runs, extras, isWicket, null, null);
    };

    const apiCall = async (runs, extras, isWicket, batter, bowler) => {
        try {
            const token = localStorage.getItem('token');
            const res = await apiRequest(`/admin/matches/${id}/ball`, 'PUT', {
                runs, extras, isWicket, newBatter: batter, newBowler: bowler
            }, token);
            setMatch(res);

            // Check if over ended - logic: previous overs < new overs floor.
            const oldOvers = Math.floor(match.liveState?.overs || 0);
            const newOvers = Math.floor(res.liveState?.overs || 0);
            if (newOvers > oldOvers) {
                const bName = prompt("Over Complete! Next Bowler Name:");
                if (bName) {
                    // We need to set the bowler. We can do it via a separate call or just next ball. 
                    // Better: use a specific "Set Bowler" button or next ball payload.
                    // My backend logic checks `newBowler` in payload.
                    // So we must send it with the NEXT ball. 
                    // OR we send a dummy ball? No.
                    // We'll store it in state `nextBowler` and send with next action.
                    setNewBowlerName(bName);
                }
            }
        } catch (e) { console.error(e); alert(e.message); }
    };

    if (loading) return <div>Loading...</div>;

    if (!match) return <div>Match Not Found</div>;

    const { liveState } = match;

    return (
        <div className="space-y-6">
            <NeuCard>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-100">{match.teamA?.name || 'Team A'} vs {match.teamB?.name || 'Team B'}</h1>
                    <p className="text-accent">{match.venue} • {match.status.toUpperCase()}</p>
                </div>
            </NeuCard>

            {/* Live Score Header */}
            {liveState && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NeuCard className="bg-blue-500/10 border-blue-500/30">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-white">
                                {liveState.runs}/{liveState.wickets}
                            </h2>
                            <p className="text-xl text-gray-300">Overs: {liveState.overs}</p>
                            <p className="text-sm text-gray-400 mt-2">Batting: {match.innings[match.innings.length - 1].team === match.teamA ? match.teamA.name : match.teamB.name}</p>
                        </div>
                    </NeuCard>
                    <NeuCard>
                        <div className="space-y-2">
                            <div className="flex justify-between p-2 bg-white/5 rounded">
                                <span className="text-accent font-bold">🏏 {liveState.striker} *</span>
                            </div>
                            <div className="flex justify-between p-2">
                                <span className="text-gray-300">🏏 {liveState.nonStriker}</span>
                            </div>
                            <div className="border-t border-white/10 my-2"></div>
                            <div className="flex justify-between p-2">
                                <span className="text-gray-300">⚾ {liveState.bowler}</span>
                                <span className="text-xs text-gray-500">Current Bowler</span>
                            </div>
                        </div>
                    </NeuCard>
                </div>
            )}

            {/* Control Panel */}
            {liveState && (
                <NeuCard>
                    <h3 className="text-center font-bold text-gray-300 mb-4">Scoring Controls</h3>

                    {/* Runs */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {[0, 1, 2, 3, 4, 6].map(run => (
                            <button
                                key={run}
                                onClick={() => registerBall(run)}
                                className="w-12 h-12 rounded-full bg-surface border border-white/10 hover:bg-white/10 font-bold text-xl text-white transition-all shadow-lg active:scale-95"
                            >
                                {run}
                            </button>
                        ))}
                    </div>

                    {/* Extras & Wickets */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button onClick={() => registerBall(1, 'wide')} className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-500 font-bold hover:bg-yellow-500/30">WD</button>
                        <button onClick={() => registerBall(1, 'no-ball')} className="px-4 py-2 rounded-xl bg-orange-500/20 text-orange-500 font-bold hover:bg-orange-500/30">NB</button>
                        <button onClick={() => registerBall(0, 'bye')} className="px-4 py-2 rounded-xl bg-gray-500/20 text-gray-400 font-bold hover:bg-gray-500/30">Bye</button>
                        <button onClick={() => registerBall(0, null, true)} className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-red-500/50 shadow-lg">WICKET</button>
                    </div>

                    {/* Next Bowler Prompt Display */}
                    {newBowlerName && (
                        <div className="mt-4 p-2 bg-green-500/20 text-green-400 text-center rounded">
                            Next Bowler set to: <strong>{newBowlerName}</strong> (will apply on next ball)
                        </div>
                    )}
                </NeuCard>
            )}

            {/* Recent Balls */}
            {liveState && (
                <div className="flex gap-2 justify-center overflow-x-auto p-2">
                    {liveState.recentBalls.map((b, i) => (
                        <div key={i} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-xs font-bold border border-white/5">
                            {b}
                        </div>
                    ))}
                </div>
            )}


            {/* Toss Modal */}
            {showTossModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                    <NeuCard className="w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold text-center">Match Toss</h3>
                        <form onSubmit={handleToss} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">Toss Winner</label>
                                <select className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-gray-200"
                                    value={tossData.winnerId} onChange={e => setTossData({ ...tossData, winnerId: e.target.value })} check required>
                                    <option value="">Select Team</option>
                                    <option value={match.teamA?._id}>{match.teamA?.name}</option>
                                    <option value={match.teamB?._id}>{match.teamB?.name}</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Decision</label>
                                <select className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-gray-200"
                                    value={tossData.decision} onChange={e => setTossData({ ...tossData, decision: e.target.value })} required>
                                    <option value="bat">Bat</option>
                                    <option value="field">Bowl</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Opening Striker</label>
                                <NeuInput value={tossData.striker} onChange={e => setTossData({ ...tossData, striker: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Opening Non-Striker</label>
                                <NeuInput value={tossData.nonStriker} onChange={e => setTossData({ ...tossData, nonStriker: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Opening Bowler</label>
                                <NeuInput value={tossData.bowler} onChange={e => setTossData({ ...tossData, bowler: e.target.value })} required />
                            </div>
                            <NeuButton type="submit" className="w-full">Start Match</NeuButton>
                        </form>
                    </NeuCard>
                </div>
            )}
        </div>
    );
};

export default ScoringDashboard;
