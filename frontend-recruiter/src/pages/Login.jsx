import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ role }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const redirectPath = await login(username, password);
            const userRole = localStorage.getItem('role');

            if (userRole !== role && userRole !== 'ADMIN') {
                toast.error(`Access Denied. You are not a ${role === 'SEEKER' ? 'Job Seeker' : 'Recruiter'}.`);
                return;
            }

            toast.success("Login Successful!");
            navigate(redirectPath || '/dashboard');
        } catch (err) {
            toast.error("Invalid credentials");
        }
    };

    const isSeeker = role === 'SEEKER';

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSeeker ? '#eff6ff' : '#fdf2f8'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {isSeeker ? '👤' : '🏢'}
                    </div>
                    <h2 style={{ color: isSeeker ? '#1e40af' : '#be185d' }}>
                        {isSeeker ? 'Job Seeker Login' : 'Recruiter Login'}
                    </h2>
                    <p style={{ color: '#6b7280' }}>
                        {isSeeker ? 'Welcome back! Find your dream job.' : 'Welcome back! Hire top talent.'}
                    </p>
                </div>

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
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            backgroundColor: isSeeker ? '#2563eb' : '#db2777',
                            borderColor: isSeeker ? '#2563eb' : '#db2777'
                        }}
                    >
                        Login
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
                    <p style={{ marginBottom: '0.5rem' }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{ color: isSeeker ? '#2563eb' : '#db2777', fontWeight: 'bold' }}
                        >
                            Register here
                        </Link>
                    </p>
                    <Link to="/" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                        ← Back to Selection
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
