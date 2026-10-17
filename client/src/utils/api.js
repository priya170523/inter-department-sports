
const API_URL = 'http://localhost:5000/api';

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const login = async (email, password) => {
    return apiRequest('/auth/login', 'POST', { email, password });
};

export const register = async (userData) => {
    return apiRequest('/auth/register', 'POST', userData);
};
