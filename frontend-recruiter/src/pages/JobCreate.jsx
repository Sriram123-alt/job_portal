import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const JobCreate = () => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        requiredSkills: ''
    });
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    // Protect route
    if (!user || user.role !== 'RECRUITER') {
        navigate('/login');
        return null;
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/recruiter/jobs', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Job Posted Successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 403) {
                const debugInfo = err.response.data.authorities ? ` (Role: ${err.response.data.authorities})` : '';
                toast.error("Access Denied" + debugInfo + ". Please login with a Recruiter account.");

                console.error("403 Debug:", err.response.data);

                // Optional: clear token specifically here if not handled globally
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                setTimeout(() => window.location.href = '/login', 3000);
            } else {
                toast.error(err.response?.data?.message || err.message || "Failed to post job.");
            }
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', color: '#1e40af' }}>Post a New Job</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Senior Software Engineer"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Company Name</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Tech Corp"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g. San Francisco, CA (Remote)"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Salary ($)</label>
                        <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 120000"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Required Skills (comma separated)</label>
                        <input
                            type="text"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Java, React, Spring Boot"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Describe the role and responsibilities..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Publish Job</button>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobCreate;
