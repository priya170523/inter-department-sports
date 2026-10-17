
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import NeuCard from '../components/ui/NeuCard';
import NeuInput from '../components/ui/NeuInput';
import NeuButton from '../components/ui/NeuButton';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        department: '',
        sport: 'Cricket',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const data = await register(formData);
            console.log('Registration success', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <NeuCard className="w-full max-w-md space-y-6 p-8">
                <h2 className="text-2xl font-bold text-center text-gray-700">Captain Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <NeuInput name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    <NeuInput name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <NeuInput name="registrationNumber" placeholder="Registration Number" value={formData.registrationNumber} onChange={handleChange} required />
                    <NeuInput name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none text-gray-100 placeholder-gray-500 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="bg-surface text-gray-500">Dept</option>
                                {['CSE', 'IT', 'MECH', 'CIVIL', 'ECE', 'EEE', 'CSDIT'].map(d => (
                                    <option key={d} value={d} className="bg-surface text-gray-100">{d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <select
                                name="sport"
                                value={formData.sport}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 outline-none text-gray-100 placeholder-gray-500 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all appearance-none cursor-pointer"
                            >
                                {['Cricket', 'Kabaddi', 'Badminton', 'Volleyball', 'Pickleball', 'Football', 'Chess', 'Carroms', 'Table Tennis', 'Basketball'].map(s => (
                                    <option key={s} value={s} className="bg-surface text-gray-100">{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <NeuInput name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <NeuInput name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    <NeuButton type="submit" className="w-full font-bold text-accent">Register Team</NeuButton>
                </form>
                <div className="text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-accent underline">Login</Link>
                </div>
            </NeuCard>
        </div>
    );
};
export default Register;
