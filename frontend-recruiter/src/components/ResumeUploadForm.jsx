import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResumeUploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
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
            const res = await axios.post('/api/profile/resume', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAnalysis(res.data);
            toast.success("Resume analyzed successfully!");
            if (onUploadSuccess) onUploadSuccess(res.data);

        } catch (err) {
            console.error(err);
            toast.error("Failed to upload/analyze resume");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="resume-upload-form">
            <div className="card">
                <h2>Upload Resume</h2>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    Upload your PDF resume to unlock personalized job matches.
                </p>
                <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ marginBottom: '1rem', display: 'block', width: '100%' }} />
                <button
                    onClick={handleUpload}
                    className="btn-primary"
                    disabled={file === null || analyzing}
                    style={{ width: '100%' }}
                >
                    {analyzing ? 'Processing Resume...' : 'Upload & Analyze Resume'}
                </button>

                {analyzing && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px dashed #cbd5e1' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <div className="spinner" style={{ width: '14px', height: '14px', border: '2px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            Analyzing profile...
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
                                <span style={{ color: '#10b981' }}>✓</span> Extracting data
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold' }}>
                                <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#2563eb', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
                                Mapping skills
                            </div>
                        </div>
                        <style>{`
                            @keyframes spin { to { transform: rotate(360deg); } }
                            @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
                        `}</style>
                    </div>
                )}

                {analysis && !analyzing && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                        <h3>Analysis Result</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                background: `conic-gradient(#2563eb ${analysis.profileScore}%, #e5e7eb 0)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '1.2rem', color: '#2563eb'
                            }}>
                                {analysis.profileScore}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Resume Score</p>
                            </div>
                        </div>
                        <p style={{ marginTop: '1rem', color: '#059669', fontWeight: 'bold' }}>
                            ✅ Profile Updated Successfully!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUploadForm;
