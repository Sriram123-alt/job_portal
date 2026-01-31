import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('SEEKER'); // SEEKER or RECRUITER
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const redirectPath = await login(username, password);
            const userRole = localStorage.getItem('role');

            // Check if user role matches the selected tab
            if (activeTab === 'RECRUITER' && userRole !== 'RECRUITER') {
                // If they are a seeker trying to login as recruiter tab, warn them
                toast.warning("You are logged in as a Job Seeker, not a Recruiter.");
            } else if (activeTab === 'SEEKER' && userRole === 'RECRUITER') {
                toast.info("Welcome Recruiter! Redirecting to your dashboard.");
            }

            toast.success("Login Successful!");
            navigate(redirectPath || '/dashboard');
        } catch (err) {
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', borderBottom: '2px solid #e5e7eb' }}>
                <button
                    onClick={() => setActiveTab('SEEKER')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'SEEKER' ? '3px solid #2563eb' : 'none',
                        fontWeight: 'bold',
                        color: activeTab === 'SEEKER' ? '#2563eb' : '#6b7280',
                        cursor: 'pointer'
                    }}
                >
                    Job Seeker
                </button>
                <button
                    onClick={() => setActiveTab('RECRUITER')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'RECRUITER' ? '3px solid #2563eb' : 'none',
                        fontWeight: 'bold',
                        color: activeTab === 'RECRUITER' ? '#2563eb' : '#6b7280',
                        cursor: 'pointer'
                    }}
                >
                    Recruiter
                </button>
            </div>

            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e40af' }}>
                {activeTab === 'SEEKER' ? 'Find Your Dream Job' : 'Hire Top Talent'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
            </form>

            <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
                Don't have an account? <a href="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>Register here</a>
            </p>
        </div>
    );
};

export default Login;
