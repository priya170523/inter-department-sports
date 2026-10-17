
import React from 'react';

const NeuInput = ({ className = '', ...props }) => {
    return (
        <input
            className={`w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none text-gray-100 placeholder-gray-500 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all ${className}`}
            {...props}
        />
    );
};

export default NeuInput;
