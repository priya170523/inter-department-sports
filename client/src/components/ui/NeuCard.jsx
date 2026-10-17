
import React from 'react';

const NeuCard = ({ children, className = '' }) => {
    return (
        <div className={`bg-surface border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}>
            {children}
        </div>
    );
};

export default NeuCard;
