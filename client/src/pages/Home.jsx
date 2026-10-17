
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroHighlight, Highlight } from '../components/ui/HeroHighlight';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import GlowingCard, { GlowingCardTitle, GlowingCardDescription } from '../components/ui/GlowingCard';
import { Trophy, Calendar, Users, Activity, ExternalLink, ArrowRight } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { motion } from 'framer-motion';

const Home = () => {
    const [stats, setStats] = useState([
        { label: 'Departments', value: '8', icon: <Users className="h-4 w-4 text-neutral-500" /> },
        { label: 'Events', value: '12', icon: <Trophy className="h-4 w-4 text-neutral-500" /> },
        { label: 'Matches', value: '45+', icon: <Activity className="h-4 w-4 text-neutral-500" /> },
        { label: 'Days', value: '5', icon: <Calendar className="h-4 w-4 text-neutral-500" /> },
    ]);
    const [liveMatches, setLiveMatches] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchesData, announcementsData] = await Promise.all([
                    apiRequest('/public/matches/live'),
                    apiRequest('/public/announcements')
                ]);
                setLiveMatches(matchesData);
                setAnnouncements(announcementsData);
            } catch (error) {
                console.error("Failed to fetch home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Poll for live matches every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <HeroHighlight>
                <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                        className="text-5xl md:text-7xl font-bold text-gray-100 tracking-tight leading-tight"
                    >
                        Inter-Department <br />
                        <Highlight>Sports 2026</Highlight>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Join the excitement! Experience the thrill of competition, teamwork, glory, and unforgettable moments as departments clash for supremacy.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                        className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
                    >
                        <Link to="/schedule">
                            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition duration-300 w-full sm:w-auto">
                                View Schedule
                            </button>
                        </Link>
                        <Link to="/volunteer">
                            <button className="px-8 py-3 rounded-full bg-white/10 border border-white/10 text-white font-bold hover:bg-white/20 transition duration-300 w-full sm:w-auto">
                                Volunteer Now
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </HeroHighlight>

            {/* Live Matches Section */}
            <section className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-1 bg-accent rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-100">Live Action</h2>
                    {liveMatches.length > 0 && (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold animate-pulse border border-red-500/20">
                            LIVE
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading matches...</div>
                ) : liveMatches.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveMatches.map((match) => (
                            <GlowingCard key={match._id}>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xs font-bold text-accent uppercase tracking-widest">{match.tournament?.sport}</span>
                                    <span className="text-xs text-green-400 font-mono">IN PROGRESS</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-white/10 mb-2 mx-auto flex items-center justify-center font-bold text-gray-300">
                                            {match.teamA?.name?.substring(0, 3)}
                                        </div>
                                        <h3 className="font-bold text-gray-100">{match.teamA?.name}</h3>
                                    </div>
                                    <div className="text-3xl font-mono font-black text-gray-100">VS</div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-white/10 mb-2 mx-auto flex items-center justify-center font-bold text-gray-300">
                                            {match.teamB?.name?.substring(0, 3)}
                                        </div>
                                        <h3 className="font-bold text-gray-100">{match.teamB?.name}</h3>
                                    </div>
                                </div>
                            </GlowingCard>
                        ))}
                    </div>
                ) : (
                    <GlowingCard className="flex flex-col items-center justify-center min-h-[250px] text-gray-500">
                        <Activity size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">No live matches at the moment</p>
                        <Link to="/schedule" className="mt-4 text-primary hover:underline">Check Schedule</Link>
                    </GlowingCard>
                )}
            </section>

            {/* Stats & Highlights Grid */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-1 bg-primary rounded-full"></div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-100">Highlights</h2>
                    </div>
                    <Link to="/announcements" className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors">
                        View All <ArrowRight size={20} />
                    </Link>
                </div>

                <BentoGrid className="max-w-7xl mx-auto">
                    {/* Stats Cards - Taking up the first column slots or a custom row */}
                    {stats.map((stat, i) => (
                        <BentoGridItem
                            key={i}
                            title={stat.value}
                            description={stat.label}
                            header={<div className="flex items-center justify-center h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/5 text-gray-100 font-black text-3xl">{stat.value}</div>}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                            icon={stat.icon}
                        />
                    ))}

                    {/* Latest Announcements */}
                    {announcements.slice(0, 3).map((item, i) => (
                        <BentoGridItem
                            key={item._id || i}
                            title={item.title}
                            description={item.content?.substring(0, 100) + "..."}
                            header={<div className="h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/5" />}
                            className={i === 0 ? "md:col-span-2" : ""}
                            icon={<ExternalLink className="h-4 w-4 text-neutral-500" />}
                        />
                    ))}
                </BentoGrid>
            </section>
        </div>
    );
};

export default Home;
