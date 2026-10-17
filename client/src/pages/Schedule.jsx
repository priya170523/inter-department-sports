
import React from 'react';
import NeuCard from '../components/ui/NeuCard';

const Schedule = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-700">Match Schedule</h1>
            <NeuCard>
                <p className="text-gray-500 text-center py-8">Schedule loading... (Placeholder)</p>
            </NeuCard>
        </div>
    );
};
export default Schedule;
