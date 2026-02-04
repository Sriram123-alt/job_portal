import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TestCountdown = ({ testDateTime, applicationId }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [canTakeTest, setCanTakeTest] = useState(false);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const testTime = new Date(testDateTime);
            const diff = testTime - now;

            if (diff <= 0) {
                setTimeLeft('Test is available now!');
                setCanTakeTest(true);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                if (days > 0) {
                    setTimeLeft(`${days}d ${hours}h ${minutes}m`);
                } else if (hours > 0) {
                    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                } else {
                    setTimeLeft(`${minutes}m ${seconds}s`);
                }
                setCanTakeTest(false);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [testDateTime]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {canTakeTest ? (
                <Link
                    to={`/test/${applicationId}`}
                    className="btn-primary"
                    style={{ background: '#10b981', fontSize: '0.85rem', padding: '0.5rem 1rem', textDecoration: 'none' }}
                >
                    🎯 Take Test
                </Link>
            ) : (
                <div style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                }}>
                    ⏱️ {timeLeft}
                </div>
            )}
        </div>
    );
};

const StatsCard = ({ title, count, color, icon }) => (
    <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${color}` }}>
        <div style={{ padding: '0.75rem', borderRadius: '50%', background: `${color}20`, color: color, fontSize: '1.5rem' }}>
            {icon}
        </div>
        <div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{title}</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{count}</h2>
        </div>
    </div>
);

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchApps = async () => {
            const token = localStorage.getItem('token');
            try {
                let res;
                if (user.role === 'SEEKER') {
                    res = await axios.get('/api/applications/my-applications', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setApplications(res.data);
                } else if (user.role === 'RECRUITER') {
                    const myJobsRes = await axios.get('/api/jobs/my-jobs', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const myJobs = myJobsRes.data;
                    const allApps = [];
                    for (const job of myJobs) {
                        const appsRes = await axios.get(`/api/applications/job/${job.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        allApps.push(...appsRes.data);
                    }
                    setApplications(allApps);
                }

            } catch (err) {
                console.error(err);
            }
        };
        fetchApps();
    }, [user]);

    const handleStatusUpdate = async (appId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.patch(`/api/applications/${appId}/status`, null, {
                params: { status: newStatus },
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(prev => prev.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
            // alert("Status Updated!"); 
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    // Calculate Stats
    const total = applications.length;
    const shortlisted = applications.filter(a => a.status === 'SHORTLISTED').length;
    const rejected = applications.filter(a => a.status === 'REJECTED').length;
    const pending = total - shortlisted - rejected;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1>{user.role === 'SEEKER' ? 'My Applications' : 'Applicant Tracking'}</h1>
                <p style={{ color: '#6b7280' }}>Track and manage your job applications progress.</p>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <StatsCard title="Total Applications" count={total} color="#2563eb" icon="📂" />
                <StatsCard title="In Review / Pending" count={pending} color="#f59e0b" icon="⏳" />
                <StatsCard title="Shortlisted" count={shortlisted} color="#10b981" icon="✅" />
                <StatsCard title="Rejected" count={rejected} color="#ef4444" icon="❌" />
            </div>

            <div className="card">
                {applications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        <p>No applications found.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem' }}>Job Title</th>
                                <th style={{ padding: '1rem' }}>{user.role === 'SEEKER' ? 'Company' : 'Applicant'}</th>
                                <th style={{ padding: '1rem' }}>Details</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                {user.role === 'SEEKER' && <th style={{ padding: '1rem' }}>Test</th>}
                                {user.role === 'RECRUITER' && <th style={{ padding: '1rem' }}>Waitlisted Resume</th>}
                                {user.role === 'RECRUITER' && <th style={{ padding: '1rem' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{app.job.title}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {user.role === 'SEEKER' ? (
                                            app.job.company
                                        ) : (
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 'bold' }}>{app.seeker.fullName || app.seeker.username}</p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{app.seeker.email}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                        applied on {new Date(app.appliedAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            background: app.status === 'APPLIED' ? '#dbeafe' : app.status === 'SHORTLISTED' ? '#d1fae5' : '#fee2e2',
                                            color: app.status === 'APPLIED' ? '#1e40af' : app.status === 'SHORTLISTED' ? '#065f46' : '#991b1b'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    {user.role === 'SEEKER' && (
                                        <td style={{ padding: '1rem' }}>
                                            {app.status === 'SHORTLISTED' && app.testDateTime ? (
                                                <div>
                                                    <TestCountdown testDateTime={app.testDateTime} applicationId={app.id} />
                                                    {app.testMessage && (
                                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                                                            📝 {app.testMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : app.status === 'SHORTLISTED' ? (
                                                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Awaiting schedule...</span>
                                            ) : app.status === 'REJECTED' ? (
                                                <span style={{ color: '#991b1b', fontSize: '0.85rem' }}>—</span>
                                            ) : (
                                                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Pending review</span>
                                            )}
                                        </td>
                                    )}
                                    {user.role === 'RECRUITER' && (
                                        <>
                                            <td style={{ padding: '1rem' }}>
                                                {/* If resumePath is a URL (from parsing) vs file path */}
                                                <a
                                                    href={app.resumePath.startsWith('http') ? app.resumePath : `${(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '').replace(/\/api$/, '')}/api/applications/download/${app.resumePath}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ color: '#2563eb', textDecoration: 'none' }}
                                                >
                                                    📄 View Resume
                                                </a>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {app.status !== 'SHORTLISTED' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                                                            title="Shortlist"
                                                            style={{
                                                                background: '#d1fae5', color: '#065f46', border: 'none',
                                                                padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer'
                                                            }}
                                                        >
                                                            ✅
                                                        </button>
                                                    )}
                                                    {app.status !== 'REJECTED' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                                            title="Reject"
                                                            style={{
                                                                background: '#fee2e2', color: '#991b1b', border: 'none',
                                                                padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer'
                                                            }}
                                                        >
                                                            ❌
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
