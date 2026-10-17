
import React from 'react';
import NeuCard from '../components/ui/NeuCard';
import NeuInput from '../components/ui/NeuInput';
import NeuButton from '../components/ui/NeuButton';

const Volunteer = () => {
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-700">Volunteer Registration</h1>
            <NeuCard className="space-y-4">
                <NeuInput placeholder="Full Name" />
                <NeuInput placeholder="Email Address" type="email" />
                <NeuInput placeholder="Registration Number" />
                <NeuInput placeholder="Department" />
                <div className="flex justify-end pt-4">
                    <NeuButton className="w-full text-accent font-bold">Register</NeuButton>
                </div>
            </NeuCard>
        </div>
    );
};
export default Volunteer;
