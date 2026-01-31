import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
    const { user } = useAuth(); // Removed logout
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setAnalyzing(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload & Parse
            const res = await axios.post('/api/profile/resume', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAnalysis(res.data);
            toast.success("Resume uploaded! Redirecting...");

            // 3. Redirect to Home (as requested in Step 1347 for completed profile)
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error(err);
            toast.error("Failed to upload/analyze resume");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '4rem auto',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Upload Resume</h1>
                <p style={{ color: '#6b7280' }}>To get started, please upload your resume (PDF only).</p>
            </div>

            <div className="card" style={{ textAlign: 'left' }}>
                <div style={{ padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '0.5rem', textAlign: 'center', marginBottom: '1.5rem', backgroundColor: '#f8fafc' }}>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        style={{ display: 'block', margin: '0 auto' }}
                    />
                </div>

                <button
                    onClick={handleUpload}
                    className="btn-primary"
                    disabled={!file || analyzing}
                    style={{ width: '100%', padding: '0.75rem' }}
                >
                    {analyzing ? 'Uploading & Analyzing...' : 'Submit Resume'}
                </button>

                {analyzing && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#2563eb' }}>
                        <div className="spinner" style={{ width: '20px', height: '20px', margin: '0 auto 0.5rem', border: '2px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        Processing your skills...
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {analysis && !analyzing && (
                    <div style={{ marginTop: '2rem', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <div style={{ color: '#059669', fontSize: '3rem', marginBottom: '0.5rem' }}>✓</div>
                        <h3 style={{ margin: 0 }}>Upload Complete!</h3>
                        <p style={{ color: '#6b7280' }}>Found {analysis.skills ? analysis.skills.split(',').length : 0} skills.</p>
                        <p>Redirecting you to jobs...</p>
                        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;
