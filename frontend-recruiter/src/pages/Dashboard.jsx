import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    useEffect(() => {
        // Search filter
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredJobs(jobs.filter(job =>
            job.title.toLowerCase().includes(lowerTerm) ||
            job.company.toLowerCase().includes(lowerTerm) ||
            job.location.toLowerCase().includes(lowerTerm)
        ));
    }, [searchTerm, jobs]);

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

    return (
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
                                    <Link to={`/job/${job.id}/applications`} style={{ textDecoration: 'none', color: '#1e40af' }}>
                                        <h3 style={{ margin: 0, cursor: 'pointer' }}>{job.title} →</h3>
                                    </Link>
                                    <p style={{ color: '#6b7280', margin: '0.25rem 0', fontSize: '0.8rem' }}>Click to view applicants</p>
                                    <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>Posted on {new Date(job.postedAt).toLocaleDateString()}</p>
                                    <p><strong>{job.location}</strong> • ${job.salary}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
};

export default Dashboard;
