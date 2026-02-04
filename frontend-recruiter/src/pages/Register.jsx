import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = ({ role }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: role // 'SEEKER' or 'RECRUITER' passed from props
    });
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure role is sent correctly
            const payload = { ...formData, role };
            await axios.post('/api/auth/register', payload);
            toast.success("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            console.error("Registration Error:", err);
            const errorMessage = err.response?.data?.message || err.response?.data || err.message || "Registration Failed";
            toast.error(typeof errorMessage === 'string' ? errorMessage : "Registration Failed (unknown error)");
        }
    };

    const isSeeker = role === 'SEEKER';

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSeeker ? '#eff6ff' : '#fdf2f8'
        }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {isSeeker ? '🚀' : '🤝'}
                    </div>
                    <h2 style={{ color: isSeeker ? '#1e40af' : '#be185d' }}>
                        {isSeeker ? 'Seeker Registration' : 'Recruiter Registration'}
                    </h2>
                    <p style={{ color: '#6b7280' }}>
                        {isSeeker ? 'Create your profile & get hired.' : 'Create an account to post jobs.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</label>
                        <input type="text" name="username" onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', marginBottom: '1rem' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                        <input type="email" name="email" onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', marginBottom: '1rem' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
                        <input type="password" name="password" onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', marginBottom: '1.5rem' }} />
                    </div>

                    {/* Role is hidden/hardcoded based on route */}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            backgroundColor: isSeeker ? '#2563eb' : '#db2777',
                            borderColor: isSeeker ? '#2563eb' : '#db2777'
                        }}
                    >
                        Register
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
                    <p style={{ marginBottom: '0.5rem' }}>
                        Already have an account?{' '}
                        <Link
                            to={`/login/${role.toLowerCase()}`}
                            style={{ color: isSeeker ? '#2563eb' : '#db2777', fontWeight: 'bold' }}
                        >
                            Login here
                        </Link>
                    </p>
                    <Link to="/" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                        ← Back to Selection
                    </Link>
                    <div style={{ marginTop: '20px', fontSize: '10px', color: '#ccc' }}>
                        API: {axios.defaults.baseURL || 'Not Configured (Relative)'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
