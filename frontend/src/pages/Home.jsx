import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center',
                borderRadius: '1rem',
                marginBottom: '3rem'
            }}>
                <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>
                    🚀 Smart Job Portal
                </h1>
                <p style={{ fontSize: '1.3rem', margin: '0 0 2rem 0', opacity: 0.95 }}>
                    AI-Powered Resume Analysis • Personalized Job Matching • One-Click Applications
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {!user ? (
                        <>
                            <Link to="/register" className="btn-primary" style={{
                                fontSize: '1.1rem',
                                padding: '0.75rem 2rem',
                                background: 'white',
                                color: '#667eea',
                                textDecoration: 'none'
                            }}>
                                Get Started Free
                            </Link>
                            <Link to="/login" style={{
                                fontSize: '1.1rem',
                                padding: '0.75rem 2rem',
                                background: 'transparent',
                                color: 'white',
                                border: '2px solid white',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                fontWeight: 'bold'
                            }}>
                                Sign In
                            </Link>
                        </>
                    ) : (
                        <Link to="/dashboard" className="btn-primary" style={{
                            fontSize: '1.1rem',
                            padding: '0.75rem 2rem',
                            background: 'white',
                            color: '#667eea',
                            textDecoration: 'none'
                        }}>
                            Apply Jobs
                        </Link>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                    Why Choose Our Platform?
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>AI Resume Analysis</h3>
                        <p style={{ color: '#6b7280' }}>
                            Upload your resume and our AI extracts your skills, experience, and education automatically using advanced PDF parsing.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Smart Job Matching</h3>
                        <p style={{ color: '#6b7280' }}>
                            Get personalized job recommendations based on your skills and profile score. Only see jobs that match your expertise.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>One-Click Apply</h3>
                        <p style={{ color: '#6b7280' }}>
                            Apply to jobs instantly using your Smart Profile. No need to re-upload your resume for every application.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Application Tracking</h3>
                        <p style={{ color: '#6b7280' }}>
                            Track all your applications in one place. See which are pending, shortlisted, or rejected with real-time updates.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Secure & Private</h3>
                        <p style={{ color: '#6b7280' }}>
                            Your data is protected with JWT authentication and role-based access control. Your resume is safe with us.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>For Recruiters Too</h3>
                        <p style={{ color: '#6b7280' }}>
                            Post jobs, manage applications, and find the perfect candidates. Complete recruitment management in one platform.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '3rem 2rem',
                marginBottom: '3rem'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                    Platform Statistics
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>24+</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Tech Skills Detected</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>100%</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Automated Parsing</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>0-100</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Profile Score Range</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>∞</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Job Opportunities</div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                    How It Works
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#dbeafe',
                            color: '#2563eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '0 auto 1rem auto'
                        }}>1</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Create Account</h3>
                        <p style={{ color: '#6b7280' }}>Sign up as a Job Seeker or Recruiter in seconds</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#dbeafe',
                            color: '#2563eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '0 auto 1rem auto'
                        }}>2</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Upload Resume</h3>
                        <p style={{ color: '#6b7280' }}>Upload your PDF resume for AI analysis</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#dbeafe',
                            color: '#2563eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '0 auto 1rem auto'
                        }}>3</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Get Matched</h3>
                        <p style={{ color: '#6b7280' }}>See personalized job recommendations instantly</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#dbeafe',
                            color: '#2563eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '0 auto 1rem auto'
                        }}>4</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Apply & Track</h3>
                        <p style={{ color: '#6b7280' }}>One-click apply and track all applications</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="card" style={{
                    background: '#f8fafc',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    border: '2px solid #e2e8f0'
                }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>
                        Ready to Find Your Dream Job?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
                        Join thousands of job seekers using AI-powered matching to land their perfect role.
                    </p>
                    <Link to="/register" className="btn-primary" style={{
                        fontSize: '1.1rem',
                        padding: '0.75rem 2.5rem',
                        textDecoration: 'none'
                    }}>
                        Start Your Journey Today
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
