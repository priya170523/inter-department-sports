import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import NeuCard from '../components/ui/NeuCard';
import NeuInput from '../components/ui/NeuInput';
import NeuButton from '../components/ui/NeuButton';

const CreateTeam = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await apiRequest('/teams', 'POST', { name }, token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create team');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <NeuCard className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-100">Create Your Team</h2>
                    <p className="text-gray-400 text-sm mt-2">
                        You verified as a Captain. Now, register your Department Team.
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Team Name</label>
                        <NeuInput
                            placeholder="e.g. CSE Warriors"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <NeuButton type="submit" className="w-full bg-accent text-white">
                        Create Team
                    </NeuButton>
                </form>
            </NeuCard>
        </div>
    );
};

export default CreateTeam;
