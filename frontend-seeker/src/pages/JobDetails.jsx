import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const token = localStorage.getItem('token');

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await axios.get(`/api/jobs/${id}`, config);
            setJob(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load job details");
            setLoading(false);
        }
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            await axios.post(`/api/applications/${id}/apply`, null, config);
            toast.success("Applied successfully! Check your applications for status.");
            navigate('/my-applications');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to apply");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div>Loading job details...</div>
            </div>
        );
    }

    if (!job) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h2>Job not found</h2>
                <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/dashboard" style={{ color: '#6b7280', textDecoration: 'none' }}>
                    ← Back to Jobs
                </Link>
            </div>

            {/* Job Header Card */}
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{job.title}</h1>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2563eb' }}>{job.company}</h3>
                        <p style={{ margin: 0, color: '#6b7280' }}>📍 {job.location}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#059669',
                            marginBottom: '0.5rem'
                        }}>
                            ${job.salary?.toLocaleString()}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Posted {new Date(job.postedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Details */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                    Job Description
                </h3>
                <p style={{ lineHeight: '1.8', color: '#4b5563', whiteSpace: 'pre-wrap' }}>
                    {job.description}
                </p>
            </div>

            {/* Required Skills */}
            {job.requiredSkills && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                        Required Skills
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {job.requiredSkills.split(',').map((skill, i) => (
                            <span key={i} style={{
                                background: '#e0e7ff',
                                color: '#3730a3',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Apply Button */}
            {user?.role === 'SEEKER' && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <button
                        onClick={handleApply}
                        disabled={applying}
                        className="btn-primary"
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.1rem',
                            opacity: applying ? 0.7 : 1
                        }}
                    >
                        {applying ? 'Applying...' : '🚀 Apply for this Job'}
                    </button>
                    <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        Your profile resume will be submitted with this application
                    </p>
                </div>
            )}

            {/* Recruiter View */}
            {user?.role === 'RECRUITER' && job.postedBy?.id === user?.id && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Link to={`/job/${id}/applications`} className="btn-primary" style={{ padding: '1rem 2rem' }}>
                        👥 View Applicants
                    </Link>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
