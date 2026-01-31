import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const JobApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const fetchApplications = async () => {
        try {
            const res = await axios.get(`/api/applications/job/${jobId}`, config);
            setApplications(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load applicants");
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        let message = '';
        if (newStatus === 'SHORTLISTED') {
            const userInput = prompt("Enter interview details or test date for the candidate:");
            if (userInput === null) return; // Cancelled
            message = userInput;
        }

        try {
            await axios.patch(`/api/applications/${appId}/status`, null, {
                ...config,
                params: {
                    status: newStatus,
                    message: message
                }
            });
            if (newStatus === 'SHORTLISTED') {
                toast.success(`Application Shortlisted. Email sent to candidate.`);
            } else {
                toast.success(`Application status updated to ${newStatus}`);
            }
            fetchApplications();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div>Loading applicants...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#1e40af' }}>Applicants for Job ID: {jobId}</h2>
                <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
            </div>

            {applications.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h3>No applicants yet.</h3>
                    <p>Applications will appear here once seekers apply.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {applications.map(app => (
                        <div key={app.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{app.seeker.fullName || app.seeker.username}</h3>
                                    <p style={{ margin: 0, color: '#6b7280' }}>Email: {app.seeker.email}</p>
                                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>

                                    <div style={{ marginTop: '0.5rem' }}>
                                        <a
                                            href={`http://localhost:8080/api/applications/download/${app.resumePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}
                                        >
                                            📄 View Resume
                                        </a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold',
                                        backgroundColor: app.status === 'SHORTLISTED' ? '#dcfce7' : app.status === 'REJECTED' ? '#fee2e2' : '#f3f4f6',
                                        color: app.status === 'SHORTLISTED' ? '#166534' : app.status === 'REJECTED' ? '#991b1b' : '#374151',
                                    }}>
                                        {app.status}
                                    </span>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                                            className="btn-primary"
                                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#10b981' }}
                                        >
                                            Shortlist
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                            className="btn-primary"
                                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#ef4444' }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobApplications;
