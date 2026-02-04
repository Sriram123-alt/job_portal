import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const token = localStorage.getItem('token');

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/profile/me', config);
            setProfile(res.data);
            if (res.data.role === 'RECRUITER') {
                setFormData({
                    companyName: res.data.companyName,
                    companyDescription: res.data.companyDescription,
                    companyLocation: res.data.companyLocation,
                    companyWebsite: res.data.companyWebsite,
                    contactPhone: res.data.contactPhone
                });
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile");
            setLoading(false);
        }
    };

    const handleRecruiterUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/profile/recruiter', formData, config);
            toast.success("Profile updated successfully!");
            setEditing(false);
            fetchProfile();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div>Loading profile...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>👤 My Profile</h1>
                <p style={{ color: '#6b7280' }}>Manage your account and profile details</p>
            </div>

            {/* User Info Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                    Account Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div style={{ color: '#6b7280' }}>Username:</div>
                    <div style={{ fontWeight: '500' }}>{profile?.username}</div>

                    <div style={{ color: '#6b7280' }}>Email:</div>
                    <div style={{ fontWeight: '500' }}>{profile?.email}</div>

                    <div style={{ color: '#6b7280' }}>Full Name:</div>
                    <div style={{ fontWeight: '500' }}>{profile?.fullName || 'Not set'}</div>

                    <div style={{ color: '#6b7280' }}>Role:</div>
                    <div>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            background: profile?.role === 'RECRUITER' ? '#dbeafe' : '#d1fae5',
                            color: profile?.role === 'RECRUITER' ? '#1e40af' : '#065f46'
                        }}>
                            {profile?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Seeker Profile */}
            {profile?.role === 'SEEKER' && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                        Seeker Profile
                    </h3>
                    {profile?.resumeUrl ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <strong style={{ color: '#374151' }}>Skills:</strong>
                                <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {profile.skills?.split(',').map((skill, i) => (
                                        <span key={i} style={{
                                            background: '#e0e7ff',
                                            color: '#3730a3',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}>
                                            {skill.trim()}
                                        </span>
                                    )) || <span style={{ color: '#6b7280' }}>No skills listed</span>}
                                </div>
                            </div>
                            <div>
                                <strong style={{ color: '#374151' }}>Experience:</strong>
                                <p style={{ margin: '0.5rem 0 0 0', color: '#4b5563' }}>
                                    {profile.experience || 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <strong style={{ color: '#374151' }}>Resume:</strong>
                                <a
                                    href={`http://localhost:8080/api/applications/download/${profile.resumeUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ marginLeft: '0.5rem', color: '#2563eb', textDecoration: 'none' }}
                                >
                                    📄 View Resume
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                Complete your profile by uploading your resume
                            </p>
                            <Link to="/resume" className="btn-primary">Upload Resume</Link>
                        </div>
                    )}
                </div>
            )}

            {/* Recruiter Profile */}
            {profile?.role === 'RECRUITER' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0 }}>Company Profile</h3>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-secondary"
                                style={{ fontSize: '0.875rem' }}
                            >
                                ✏️ Edit
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <form onSubmit={handleRecruiterUpdate}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Name</label>
                                    <input
                                        type="text"
                                        value={formData.companyName || ''}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Description</label>
                                    <textarea
                                        value={formData.companyDescription || ''}
                                        onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                                        rows={3}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
                                    <input
                                        type="text"
                                        value={formData.companyLocation || ''}
                                        onChange={(e) => setFormData({ ...formData, companyLocation: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Website</label>
                                    <input
                                        type="url"
                                        value={formData.companyWebsite || ''}
                                        onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone || ''}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                            <div style={{ color: '#6b7280' }}>Company:</div>
                            <div style={{ fontWeight: '500' }}>{profile?.companyName || 'Not set'}</div>

                            <div style={{ color: '#6b7280' }}>Description:</div>
                            <div>{profile?.companyDescription || 'Not set'}</div>

                            <div style={{ color: '#6b7280' }}>Location:</div>
                            <div>{profile?.companyLocation || 'Not set'}</div>

                            <div style={{ color: '#6b7280' }}>Website:</div>
                            <div>
                                {profile?.companyWebsite ? (
                                    <a href={profile.companyWebsite} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                                        {profile.companyWebsite}
                                    </a>
                                ) : 'Not set'}
                            </div>

                            <div style={{ color: '#6b7280' }}>Phone:</div>
                            <div>{profile?.contactPhone || 'Not set'}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Links */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
                {profile?.role === 'SEEKER' && <Link to="/my-applications" className="btn-primary">View Applications</Link>}
                {profile?.role === 'RECRUITER' && <Link to="/create-job" className="btn-primary">Post New Job</Link>}
            </div>
        </div>
    );
};

export default Profile;
