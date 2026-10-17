
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import NeuCard from '../components/ui/NeuCard';
import NeuInput from '../components/ui/NeuInput';
import NeuButton from '../components/ui/NeuButton';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(formData.email, formData.password);
            console.log('Login success', data);

            // Save token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <NeuCard className="w-full max-w-md space-y-6 p-8">
                <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <NeuInput
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <NeuInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <NeuButton type="submit" className="w-full font-bold text-accent">Sign In</NeuButton>
                </form>
                <div className="text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-accent underline">Register as Captain</Link>
                </div>
            </NeuCard>
        </div>
    );
};
export default Login;
