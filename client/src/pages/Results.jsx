
import React from 'react';
import NeuCard from '../components/ui/NeuCard';

const Results = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-700">Match Results</h1>
            <NeuCard>
                <div className="flex justify-between border-b pb-4 mb-4 border-gray-300">
                    <span className="font-bold">CSE vs MECHANICAL</span>
                    <span className="text-accent font-bold">3 - 1</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">CIVIL vs EEE</span>
                    <span className="text-accent font-bold">0 - 2</span>
                </div>
            </NeuCard>
        </div>
    );
};
export default Results;
