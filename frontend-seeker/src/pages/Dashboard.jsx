import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ResumeUploadForm from '../components/ResumeUploadForm';

// Countdown component for scheduled tests
const TestCountdown = ({ testDateTime, applicationId, jobTitle, company, message }) => {
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
        <div className="card" style={{
            borderLeft: canTakeTest ? '4px solid #10b981' : '4px solid #f59e0b',
            background: canTakeTest ? 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)' : 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>{jobTitle}</h4>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{company}</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#374151' }}>
                        📅 {new Date(testDateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    {message && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>
                            📝 "{message}"
                        </p>
                    )}
                </div>
                <div style={{ textAlign: 'right' }}>
                    {canTakeTest ? (
                        <Link
                            to={`/test/${applicationId}`}
                            className="btn-primary"
                            style={{ background: '#10b981', padding: '0.75rem 1.5rem', textDecoration: 'none' }}
                        >
                            🎯 Take Test Now
                        </Link>
                    ) : (
                        <div style={{
                            background: '#f59e0b',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}>
                            ⏱️ {timeLeft}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [scheduledTests, setScheduledTests] = useState([]);
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        fetchPublicJobs();
        fetchAppStats();
    }, []);

    const fetchAppStats = async () => {
        try {
            const res = await axios.get('/api/applications/my-applications', config);

            // Extract scheduled tests
            const tests = res.data
                .filter(app => app.status === 'SHORTLISTED' && app.testDateTime)
                .map(app => ({
                    id: app.id,
                    testDateTime: app.testDateTime,
                    testMessage: app.testMessage,
                    jobTitle: app.job.title,
                    company: app.job.company
                }))
                .sort((a, b) => new Date(a.testDateTime) - new Date(b.testDateTime));

            setScheduledTests(tests);
        } catch (err) {
            console.error("Failed to fetch app stats", err);
        }
    };

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredJobs(jobs.filter(job =>
            job.title.toLowerCase().includes(lowerTerm) ||
            job.company.toLowerCase().includes(lowerTerm) ||
            job.location.toLowerCase().includes(lowerTerm)
        ));
    }, [searchTerm, jobs]);

    const fetchPublicJobs = async () => {
        try {
            // For Seekers with resumes, get recommendations.
            const endpoint = (user.resumeUrl || user.skills)
                ? '/api/jobs/recommendations'
                : '/api/jobs/public';

            const res = await axios.get(endpoint, config);
            setJobs(res.data);
            setFilteredJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApply = async (jobId) => {
        try {
            await axios.post(`/api/applications/${jobId}/apply`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Applied successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to apply");
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1>{(user.resumeUrl || user.skills) ? '🎯 Jobs Recommended for You' : '💼 Browse All Jobs'}</h1>
                <p style={{ color: '#6b7280' }}>
                    {(user.resumeUrl || user.skills) ? 'Personalized matches based on your Smart Profile' : 'Explore opportunities and find your perfect role'}
                </p>
            </div>

            {/* Scheduled Tests Section */}
            {scheduledTests.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '0.75rem 0.75rem 0 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{ margin: 0 }}>🎯 Your Scheduled Tests</h2>
                        <span style={{
                            background: 'white',
                            color: '#1e40af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                        }}>
                            {scheduledTests.length} upcoming
                        </span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: '0 0 0.75rem 0.75rem',
                        border: '1px solid #e2e8f0',
                        borderTop: 'none'
                    }}>
                        {scheduledTests.map(test => (
                            <TestCountdown
                                key={test.id}
                                applicationId={test.id}
                                testDateTime={test.testDateTime}
                                jobTitle={test.jobTitle}
                                company={test.company}
                                message={test.testMessage}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Resume Upload Prompt */}
            {(!user.resumeUrl) ? (
                <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                    <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                        <div style={{
                            background: '#fef2f2',
                            border: '2px solid #fecaca',
                            borderRadius: '0.75rem',
                            padding: '2rem',
                            marginBottom: '2rem'
                        }}>
                            <h2 style={{ color: '#dc2626', margin: '0 0 1rem 0' }}>📄 Resume Required</h2>
                            <p style={{ fontSize: '1.1rem', color: '#991b1b', margin: 0 }}>
                                Please upload your resume to unlock job opportunities and get personalized recommendations.
                            </p>
                        </div>
                        <ResumeUploadForm onUploadSuccess={() => {
                            window.location.reload();
                        }} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by title, company, or location..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredJobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <p style={{ color: '#6b7280' }}>No jobs match your search.</p>
                            </div>
                        ) : (
                            filteredJobs.map(job => (
                                <div key={job.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h3>{job.title}</h3>
                                        <div style={{
                                            background: '#dbeafe', color: '#1e40af',
                                            padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', height: 'fit-content'
                                        }}>
                                            Active
                                        </div>
                                    </div>
                                    <h4 style={{ color: '#2563eb', margin: '0.5rem 0' }}>{job.company}</h4>
                                    <p style={{ color: '#4b5563', margin: '0.5rem 0' }}>📍 {job.location}</p>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{job.description}</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${job.salary}</span>
                                        <button onClick={() => handleApply(job.id)} className="btn-primary">Apply Now</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Activity Preview */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>Your Activity</h2>
                    <Link to="/my-applications" style={{ color: '#2563eb', textDecoration: 'none' }}>View All Applications &rarr;</Link>
                </div>
                <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '50%' }}>📂</div>
                    <div>
                        <h4 style={{ margin: 0 }}>Track Your Applications</h4>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>Check the status of your applied jobs.</p>
                    </div>
                    <Link to="/my-applications" className="btn-secondary" style={{ marginLeft: 'auto' }}>
                        Check Status
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
