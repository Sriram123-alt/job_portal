import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ResumeUploadForm from '../components/ResumeUploadForm';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [appStats, setAppStats] = useState({ total: 0, pending: 0, shortlisted: 0, rejected: 0 });
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        if (user.role === 'RECRUITER') {
            fetchMyJobs();
        } else {
            fetchPublicJobs();
            fetchAppStats();
        }
    }, [user.role]);

    const fetchAppStats = async () => {
        try {
            const res = await axios.get('/api/applications/my-applications', config);
            const total = res.data.length;
            const shortlisted = res.data.filter(a => a.status === 'SHORTLISTED').length;
            const rejected = res.data.filter(a => a.status === 'REJECTED').length;
            const pending = res.data.filter(a => a.status === 'APPLIED').length;
            setAppStats({ total, pending, shortlisted, rejected });
        } catch (err) {
            console.error("Failed to fetch app stats", err);
        }
    };

    useEffect(() => {
        // Search filter only for Seekers (Public Jobs) or Recruiters filtering their own jobs
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredJobs(jobs.filter(job =>
            job.title.toLowerCase().includes(lowerTerm) ||
            job.company.toLowerCase().includes(lowerTerm) ||
            job.location.toLowerCase().includes(lowerTerm)
        ));
    }, [searchTerm, jobs]);

    const fetchPublicJobs = async () => {
        try {
            // For Seekers with resumes, get recommendations. For others, get public jobs.
            const endpoint = (user.role === 'SEEKER' && (user.seekerProfile?.resumeUrl || user.seekerProfile?.skills))
                ? '/api/jobs/recommendations'
                : '/api/jobs/public';

            const res = await axios.get(endpoint, config);
            setJobs(res.data);
            setFilteredJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyJobs = async () => {
        try {
            const res = await axios.get('/api/recruiter/jobs', config);
            setJobs(res.data);
            setFilteredJobs(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your jobs");
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

    const handleDelete = async (jobId) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            await axios.delete(`/api/recruiter/jobs/${jobId}`, config);
            toast.success("Job deleted");
            fetchMyJobs(); // Rerender
        } catch (err) {
            toast.error("Failed to delete. Ensure this is your job.");
        }
    };

    const RecruiterView = () => (
        <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Recruiter Dashboard</h1>
                    <p style={{ color: '#6b7280' }}>Manage your job postings and applicants</p>
                </div>
                <Link to="/create-job" className="btn-primary">
                    + Post New Job
                </Link>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search your jobs..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredJobs.length === 0 ? (
                    <p>No jobs posted yet.</p>
                ) : (
                    filteredJobs.map(job => (
                        <div key={job.id} className="card" style={{ borderLeft: '4px solid #2563eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3>{job.title}</h3>
                                    <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>Posted on {new Date(job.postedAt).toLocaleDateString()}</p>
                                    <p><strong>{job.location}</strong> • ${job.salary}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/job/${job.id}/applications`} className="btn-secondary" style={{ fontSize: '0.875rem' }}>View Applicants</Link>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.5rem', borderRadius: '0.375rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const SeekerView = () => (
        <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1>{(user.role === 'SEEKER' && user.seekerProfile && (user.seekerProfile.resumeUrl || user.seekerProfile.skills)) ? '🎯 Jobs Recommended for You' : '💼 Browse All Jobs'}</h1>
                <p style={{ color: '#6b7280' }}>
                    {(user.role === 'SEEKER' && user.seekerProfile && (user.seekerProfile.resumeUrl || user.seekerProfile.skills)) ? 'Personalized matches based on your Smart Profile' : 'Explore opportunities and find your perfect role'}
                </p>
            </div>

            {/* Check if user has resume - if not, show upload prompt */}
            {(!user.seekerProfile || !user.seekerProfile.resumeUrl) ? (
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
                    {/* Progress Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div className="card" style={{ borderLeft: '4px solid #2563eb', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' }}>TOTAL APPLIED</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e40af' }}>{appStats.total}</span>
                        </div>
                        <div className="card" style={{ borderLeft: '4px solid #f59e0b', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' }}>PENDING</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#92400e' }}>{appStats.pending}</span>
                        </div>
                        <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' }}>SHORTLISTED</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#065f46' }}>{appStats.shortlisted}</span>
                        </div>
                        <div className="card" style={{ borderLeft: '4px solid #ef4444', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' }}>REJECTED</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#991b1b' }}>{appStats.rejected}</span>
                        </div>
                    </div>

                    {/* Profile Summary Section */}
                    <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <h3 style={{ margin: '0 0 1rem 0' }}>👤 Your Smart Profile</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <p style={{ margin: '0.25rem 0', opacity: 0.9 }}><strong>Name:</strong> {user.fullName || 'Not extracted'}</p>
                                <p style={{ margin: '0.25rem 0', opacity: 0.9 }}><strong>Email:</strong> {user.email || 'Not available'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '0.25rem 0', opacity: 0.9 }}><strong>Skills:</strong> {user.seekerProfile?.skills || 'None detected'}</p>
                                <p style={{ margin: '0.25rem 0', opacity: 0.9 }}><strong>Profile Score:</strong> {user.seekerProfile?.profileScore || 0}/100</p>
                            </div>
                        </div>
                        <Link to="/resume" style={{
                            display: 'inline-block',
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: 'white',
                            color: '#667eea',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>
                            Update Resume
                        </Link>
                    </div>

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

            {/* Recent Applications Preview */}
            {
                user.role === 'SEEKER' && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2>Your Activity</h2>
                            <Link to="/my-applications" style={{ color: '#2563eb', textDecoration: 'none' }}>View All Applications &rarr;</Link>
                        </div>
                        {/* We could fetch real applications here, but for MVP let's just link them or show a static banner if empty.
                         Better: Use a quick fetch or just rely on MyApplications page. 
                         Let's keep it simple: A quick link card. */}
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
                )
            }
        </div >
    );

    return (
        <div>
            {user.role === 'RECRUITER' ? <RecruiterView /> : <SeekerView />}
        </div>
    );
};

export default Dashboard;
