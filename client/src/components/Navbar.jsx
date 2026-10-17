import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NeuButton from './ui/NeuButton';
import { Home, Calendar, Trophy, ClipboardList, Megaphone, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const navItems = [
        { path: '/', label: 'Home', icon: <Home size={18} /> },
        { path: '/schedule', label: 'Schedule', icon: <Calendar size={18} /> },
        { path: '/brackets', label: 'Brackets', icon: <ClipboardList size={18} /> },
        { path: '/results', label: 'Results', icon: <Trophy size={18} /> },
        { path: '/announcements', label: 'Updates', icon: <Megaphone size={18} /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 md:top-4 md:bottom-auto z-50 px-4 flex justify-center">
            <div className="bg-surface/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-2 md:gap-6 overflow-x-auto max-w-full">
                <Link to="/" className="hidden md:block text-xl font-bold text-gray-100 tracking-wider mr-4">
                    SPORTS<span className="text-accent">HUB</span>
                </Link>

                {navItems.map((item) => (
                    <Link key={item.path} to={item.path}>
                        <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 text-sm font-medium ${isActive(item.path) ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
                            {item.icon}
                            <span className="hidden lg:inline">{item.label}</span>
                        </button>
                    </Link>
                ))}

                <div className="w-px h-6 bg-white/10 hidden md:block mx-2"></div>

                {localStorage.getItem('token') ? (
                    <div className="flex items-center gap-2">
                        <Link to={JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? '/admin' : '/dashboard'}>
                            <button className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-bold ${(isActive('/dashboard') || isActive('/admin')) ? 'bg-accent text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                                <User size={18} />
                                <span className="hidden md:inline">Dashboard</span>
                            </button>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-500"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-bold ${isActive('/login') ? 'bg-accent text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                            <User size={18} />
                            <span className="hidden md:inline">Login</span>
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
