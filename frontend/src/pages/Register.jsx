import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'SEEKER'
    });
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            toast.success("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.response?.data || "Registration Failed. Please try again.";
            toast.error(typeof errorMessage === 'string' ? errorMessage : "Registration Failed.");
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2 style={{ textAlign: 'center' }}>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" onChange={handleChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <div>
                    <label>Role</label>
                    <select name="role" onChange={handleChange} value={formData.role}>
                        <option value="SEEKER">Job Seeker</option>
                        <option value="RECRUITER">Recruiter</option>
                    </select>
                </div>
                <button type="submit" style={{ width: '100%' }}>Register</button>
            </form>
        </div>
    );
};

export default Register;
