import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import NeuButton from './ui/NeuButton';

const Footer = () => {
    return (
        <footer className="mt-auto py-8 border-t border-white/10 bg-surface/50 text-gray-400 text-sm">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <p className="font-semibold text-gray-200">© 2025 SportsHub.</p>
                    <p>Inter-Department Sports Management</p>
                </div>

                <div className="flex gap-4">
                    <button className="p-2 rounded-full hover:bg-white/10 transition">
                        <Github size={18} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition">
                        <Twitter size={18} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition">
                        <Linkedin size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <span>Made with</span>
                    <Heart size={14} className="text-accent fill-current animate-pulse" />
                    <span>for Students</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
