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
                    🎯 Recruitment Hub
                </h1>
                <p style={{ fontSize: '1.3rem', margin: '0 0 2rem 0', opacity: 0.95 }}>
                    AI-Powered Candidate Matching • Streamlined Hiring • Comprehensive Applicant Management
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
                            Post Jobs
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
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Smart Matching</h3>
                        <p style={{ color: '#6b7280' }}>
                            Our AI automatically matches candidates to your jobs based on skills, experience, and profile scores.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Post Jobs Easily</h3>
                        <p style={{ color: '#6b7280' }}>
                            Create job listings in minutes. Define requirements, set parameters, and reach qualified candidates instantly.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Manage Applications</h3>
                        <p style={{ color: '#6b7280' }}>
                            Review, shortlist, and reject applications in one place. Schedule tests and track candidate progress effortlessly.
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Candidate Assessment</h3>
                        <p style={{ color: '#6b7280' }}>
                            Schedule automated tests for shortlisted candidates. Evaluate skills and make data-driven hiring decisions.
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
                        <h3 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>For Job Seekers Too</h3>
                        <p style={{ color: '#6b7280' }}>
                            Our platform also serves job seekers with AI-powered resume parsing and smart job matching.
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
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>50+</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Active Job Listings</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>AI</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Powered Matching</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>Fast</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Hiring Process</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>∞</div>
                        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Qualified Candidates</div>
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
                        <p style={{ color: '#6b7280' }}>Sign up as a Recruiter in seconds</p>
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
                        <h3 style={{ marginBottom: '0.5rem' }}>Post Job Listing</h3>
                        <p style={{ color: '#6b7280' }}>Create detailed job posts with requirements</p>
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
                        <h3 style={{ marginBottom: '0.5rem' }}>Find Matches</h3>
                        <p style={{ color: '#6b7280' }}>AI matches qualified candidates to your jobs</p>
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
                        <h3 style={{ marginBottom: '0.5rem' }}>Review & Hire</h3>
                        <p style={{ color: '#6b7280' }}>Manage applications and schedule tests</p>
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
                        Ready to Find Top Talent?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
                        Join hundreds of recruiters using AI-powered matching to find the perfect candidates faster.
                    </p>
                    <Link to="/register" className="btn-primary" style={{
                        fontSize: '1.1rem',
                        padding: '0.75rem 2.5rem',
                        textDecoration: 'none'
                    }}>
                        Start Hiring Today
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;
