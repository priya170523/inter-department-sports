
import React from 'react';

const NeuButton = ({ children, onClick, type = 'button', className = '', active = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-[0.98] 
                ${active
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'bg-surface border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white'} 
                ${className}`}
        >
            {children}
        </button>
    );
};

export default NeuButton;
