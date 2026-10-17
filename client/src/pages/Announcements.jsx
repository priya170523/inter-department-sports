
import React from 'react';
import NeuCard from '../components/ui/NeuCard';

const Announcements = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-700">Announcements</h1>
            <NeuCard className="space-y-2">
                <h3 className="font-bold text-lg text-red-500">Weather Alert</h3>
                <p className="text-gray-600">Matches scheduled for tomorrow 2 PM are postponed due to rain forecast.</p>
                <p className="text-xs text-gray-400">posted 2 hours ago</p>
            </NeuCard>
        </div>
    );
};
export default Announcements;
