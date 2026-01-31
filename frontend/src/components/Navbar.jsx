import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [appCount, setAppCount] = useState(0);

    useEffect(() => {
        const fetchAppCount = async () => {
            if (user && user.role === 'SEEKER') {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('/api/applications/my-applications', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const pending = res.data.filter(a => a.status === 'APPLIED').length;
                    setAppCount(pending);
                } catch (err) {
                    console.error("Failed to fetch app count", err);
                }
            }
        };
        fetchAppCount();

        const interval = setInterval(fetchAppCount, 30000); // 30s
        return () => clearInterval(interval);
    }, [user]);

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#2563eb' }}>
                    JobPortal
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            {/* Recruiter Links */}
                            {user.role === 'RECRUITER' && (
                                <>
                                    <Link to="/dashboard">Manage Jobs</Link>
                                    <Link to="/my-applications">Applicants</Link>
                                </>
                            )}

                            {/* Seeker Links */}
                            {user.role === 'SEEKER' && (
                                <>
                                    <Link to="/dashboard" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: '500'
                                    }}>
                                        💼 Jobs
                                    </Link>
                                    <Link to="/my-applications" style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: '500'
                                    }}>
                                        📋 My Applications
                                        {appCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-12px',
                                                background: '#ef4444',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                padding: '2px 6px',
                                                borderRadius: '50%',
                                                fontWeight: 'bold',
                                                minWidth: '18px',
                                                textAlign: 'center'
                                            }}>
                                                {appCount}
                                            </span>
                                        )}
                                    </Link>

                                </>
                            )}

                            <div style={{ position: 'relative', marginLeft: '1rem' }} className="profile-dropdown">
                                <button
                                    className="btn-secondary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e5e7eb' }}
                                    onClick={(e) => {
                                        const el = e.currentTarget.nextElementSibling;
                                        el.style.display = el.style.display === 'block' ? 'none' : 'block';
                                    }}
                                    onBlur={(e) => {
                                        setTimeout(() => {
                                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'none';
                                        }, 200);
                                    }}
                                >
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                        {user.fullName ? user.fullName.charAt(0) : user.username.charAt(0)}
                                    </div>
                                    <span>{user.fullName || user.username}</span>
                                    <span style={{ fontSize: '0.7rem' }}>▼</span>
                                </button>

                                <div style={{
                                    display: 'none', position: 'absolute', right: 0, top: '100%',
                                    background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', minWidth: '200px', zIndex: 10
                                }}>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{user.fullName || user.username}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{user.email || 'No email'}</p>
                                        {user.role === 'SEEKER' && (
                                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: user.seekerProfile?.resumeUrl ? '#059669' : '#dc2626' }}>
                                                {user.seekerProfile?.resumeUrl ? '✅ Resume Uploaded' : '❌ Resume Missing'}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={logout}
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444'
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn-primary" style={{ color: 'white' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
