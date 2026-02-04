import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Test Scheduling Modal Component
const TestScheduleModal = ({ isOpen, onClose, onSubmit, applicantName }) => {
    const [testDate, setTestDate] = useState('');
    const [testTime, setTestTime] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Get tomorrow's date as minimum date
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!testDate || !testTime) {
            toast.error('Please select both date and time');
            return;
        }
        setLoading(true);
        try {
            await onSubmit(testDate, testTime, message);
            setTestDate('');
            setTestTime('');
            setMessage('');
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, color: '#1e40af' }}>📅 Schedule Test</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#6b7280'
                        }}
                    >×</button>
                </div>

                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Schedule an online test for <strong>{applicantName}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                            Test Date *
                        </label>
                        <input
                            type="date"
                            value={testDate}
                            onChange={(e) => setTestDate(e.target.value)}
                            min={getTomorrowDate()}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #d1d5db',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                            Test Time *
                        </label>
                        <input
                            type="time"
                            value={testTime}
                            onChange={(e) => setTestTime(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #d1d5db',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                            Instructions for Candidate (Optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="e.g., Please ensure stable internet connection and join 5 minutes early..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #d1d5db',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #d1d5db',
                                background: 'white',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#10b981',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Scheduling...' : '✅ Schedule Test'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const JobApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
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

    const openScheduleModal = (app) => {
        setSelectedApp(app);
        setModalOpen(true);
    };

    const handleScheduleTest = async (testDate, testTime, message) => {
        const testDateTime = `${testDate}T${testTime}:00`;

        try {
            await axios.patch(`/api/applications/${selectedApp.id}/status`, null, {
                ...config,
                params: {
                    status: 'SHORTLISTED',
                    message: message,
                    testDateTime: testDateTime
                }
            });
            toast.success(`✅ Test scheduled for ${testDate} at ${testTime}`);
            fetchApplications();
        } catch (err) {
            console.error("Status update error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || err.response?.data || "Failed to schedule test");
            throw err;
        }
    };

    const handleReject = async (appId) => {
        if (!confirm("Are you sure you want to reject this application?")) return;

        try {
            await axios.patch(`/api/applications/${appId}/status`, null, {
                ...config,
                params: { status: 'REJECTED' }
            });
            toast.success("Application rejected");
            fetchApplications();
        } catch (err) {
            console.error(err);
            toast.error("Failed to reject application");
        }
    };

    const handleScheduleAll = async (testDate, testTime, message) => {
        const testDateTime = `${testDate}T${testTime}:00`;

        try {
            await axios.post(`/api/applications/${jobId}/schedule-all`, null, {
                ...config,
                params: {
                    testDateTime: testDateTime,
                    message: message
                }
            });
            toast.success("✅ Tests scheduled for all applicants!");
            fetchApplications();
        } catch (err) {
            console.error(err);
            toast.error("Failed to schedule bulk tests");
            throw err;
        }
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return null;
        const dt = new Date(dateTimeStr);
        return dt.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    if (loading) return <div>Loading applicants...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#1e40af' }}>Applicants for Job ID: {jobId}</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {applications.length > 0 && (
                        <button
                            onClick={() => {
                                setSelectedApp(null);
                                setModalOpen(true);
                            }}
                            className="btn-primary"
                            style={{ backgroundColor: '#7c3aed' }}
                        >
                            📅 Schedule All
                        </button>
                    )}
                    <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
                </div>
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

                                    {/* Show scheduled test info */}
                                    {app.status === 'SHORTLISTED' && app.testDateTime && (
                                        <div style={{
                                            marginTop: '0.75rem',
                                            padding: '0.75rem',
                                            background: '#d1fae5',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.9rem'
                                        }}>
                                            <strong style={{ color: '#065f46' }}>📅 Test Scheduled:</strong>
                                            <span style={{ marginLeft: '0.5rem', color: '#047857' }}>
                                                {formatDateTime(app.testDateTime)}
                                            </span>
                                            {app.testMessage && (
                                                <p style={{ margin: '0.5rem 0 0 0', color: '#065f46', fontStyle: 'italic' }}>
                                                    "{app.testMessage}"
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Show test score for recruiters */}
                                    {app.testScore !== null && app.testScore !== undefined && (
                                        <div style={{
                                            marginTop: '0.75rem',
                                            padding: '0.75rem',
                                            background: app.testScore >= 60 ? '#dbeafe' : '#fef3c7',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <span style={{ fontSize: '1.2rem' }}>{app.testScore >= 60 ? '🏆' : '📝'}</span>
                                            <div>
                                                <strong style={{ color: app.testScore >= 60 ? '#1e40af' : '#92400e' }}>
                                                    Test Score: {app.testScore}%
                                                </strong>
                                                <span style={{ marginLeft: '0.5rem', color: '#6b7280', fontSize: '0.8rem' }}>
                                                    {app.testScore >= 60 ? 'Passed' : 'Below threshold'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
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
                                        {app.status !== 'SHORTLISTED' && (
                                            <button
                                                onClick={() => openScheduleModal(app)}
                                                className="btn-primary"
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#10b981' }}
                                            >
                                                ✅ Shortlist & Schedule
                                            </button>
                                        )}
                                        {app.status === 'SHORTLISTED' && !app.testDateTime && (
                                            <button
                                                onClick={() => openScheduleModal(app)}
                                                className="btn-primary"
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#3b82f6' }}
                                            >
                                                📅 Schedule Test
                                            </button>
                                        )}
                                        {app.status !== 'REJECTED' && (
                                            <button
                                                onClick={() => handleReject(app.id)}
                                                className="btn-primary"
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#ef4444' }}
                                            >
                                                ❌ Reject
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Test Schedule Modal */}
            <TestScheduleModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedApp(null);
                }}
                onSubmit={selectedApp ? handleScheduleTest : handleScheduleAll}
                applicantName={selectedApp ? (selectedApp.seeker?.fullName || selectedApp.seeker?.username) : 'ALL Applicants'}
            />
        </div>
    );
};

export default JobApplications;
