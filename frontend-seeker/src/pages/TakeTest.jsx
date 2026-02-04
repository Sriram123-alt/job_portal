import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const TakeTest = () => {
    const { applicationId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testStarted, setTestStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Sample test questions (in a real app, these would come from the backend)
    const questions = [
        {
            id: 1,
            question: "What is the primary purpose of a constructor in object-oriented programming?",
            options: [
                "To destroy objects",
                "To initialize object properties",
                "To create loops",
                "To define methods"
            ],
            correct: 1
        },
        {
            id: 2,
            question: "Which data structure uses LIFO (Last In, First Out) principle?",
            options: [
                "Queue",
                "Array",
                "Stack",
                "Linked List"
            ],
            correct: 2
        },
        {
            id: 3,
            question: "What does API stand for?",
            options: [
                "Application Programming Interface",
                "Automated Program Installation",
                "Advanced Programming Integration",
                "Application Process Interface"
            ],
            correct: 0
        },
        {
            id: 4,
            question: "Which HTTP method is typically used to update an existing resource?",
            options: [
                "GET",
                "POST",
                "PUT",
                "DELETE"
            ],
            correct: 2
        },
        {
            id: 5,
            question: "What is the time complexity of binary search?",
            options: [
                "O(n)",
                "O(n²)",
                "O(log n)",
                "O(1)"
            ],
            correct: 2
        }
    ];

    useEffect(() => {
        fetchApplication();
    }, [applicationId]);

    useEffect(() => {
        let timer;
        if (testStarted && timeRemaining > 0 && !submitted) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [testStarted, submitted]);

    const fetchApplication = async () => {
        try {
            const res = await axios.get('/api/applications/my-applications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const app = res.data.find(a => a.id === parseInt(applicationId));
            if (app) {
                setApplication(app);
                // Check if test time has arrived
                if (app.testDateTime) {
                    const testTime = new Date(app.testDateTime);
                    const now = new Date();
                    if (now < testTime) {
                        toast.error("Test time has not started yet!");
                        navigate('/my-applications');
                    }
                }
            } else {
                toast.error("Application not found");
                navigate('/my-applications');
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load test");
            setLoading(false);
        }
    };

    const handleStartTest = () => {
        setTestStarted(true);
        toast.info("Test started! You have 30 minutes.");
    };

    const handleAnswerChange = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = async () => {
        if (submitted) return;

        // Calculate score
        let correct = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct) {
                correct++;
            }
        });

        const score = Math.round((correct / questions.length) * 100);
        setSubmitted(true);

        // Save score to backend
        try {
            await axios.post(`/api/applications/${applicationId}/test-score`, null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { score }
            });
            toast.success("Test submitted successfully!");
        } catch (err) {
            console.error("Failed to save score:", err);
            toast.warning("Test completed, but failed to save to server.");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div>Loading test...</div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
                <div className="card" style={{ padding: '3rem' }}>
                    <h1 style={{ color: '#10b981', marginBottom: '1rem' }}>
                        🎉 Test Submitted!
                    </h1>
                    <h2 style={{ color: '#374151' }}>Thank you for completing the test</h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                        Your answers have been recorded. The recruiter will review your results and contact you with the next steps.
                    </p>
                    <div style={{
                        background: '#d1fae5',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        marginBottom: '2rem'
                    }}>
                        <p style={{ color: '#065f46', margin: 0 }}>
                            ✅ Your test has been submitted successfully. Good luck!
                        </p>
                    </div>
                    <Link to="/my-applications" className="btn-primary">
                        Back to My Applications
                    </Link>
                </div>
            </div>
        );
    }

    if (!testStarted) {
        return (
            <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h1 style={{ color: '#1e40af', marginBottom: '1rem' }}>🎯 Online Assessment</h1>
                    {application && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: '#374151' }}>
                                {application.job.title} at {application.job.company}
                            </h3>
                            {application.testMessage && (
                                <p style={{ color: '#6b7280', marginTop: '1rem', fontStyle: 'italic' }}>
                                    📝 "{application.testMessage}"
                                </p>
                            )}
                        </div>
                    )}

                    <div style={{
                        background: '#fef3c7',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        marginBottom: '2rem',
                        textAlign: 'left'
                    }}>
                        <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>⚠️ Instructions:</h4>
                        <ul style={{ color: '#78350f', margin: 0, paddingLeft: '1.5rem' }}>
                            <li>You have <strong>30 minutes</strong> to complete this test</li>
                            <li>There are <strong>{questions.length} multiple choice questions</strong></li>
                            <li>You cannot pause or restart the test once started</li>
                            <li>The test will auto-submit when time runs out</li>
                            <li>Make sure you have a stable internet connection</li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/my-applications" className="btn-secondary">
                            ← Go Back
                        </Link>
                        <button onClick={handleStartTest} className="btn-primary" style={{ padding: '1rem 2rem' }}>
                            🚀 Start Test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
            {/* Timer Header */}
            <div style={{
                position: 'sticky',
                top: '0',
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 100
            }}>
                <div>
                    <h3 style={{ margin: 0 }}>{application?.job.title}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                        {Object.keys(answers).length}/{questions.length} answered
                    </p>
                </div>
                <div style={{
                    background: timeRemaining < 300 ? '#fee2e2' : '#dbeafe',
                    color: timeRemaining < 300 ? '#991b1b' : '#1e40af',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '1.25rem'
                }}>
                    ⏱️ {formatTime(timeRemaining)}
                </div>
            </div>

            {/* Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {questions.map((q, index) => (
                    <div key={q.id} className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ color: '#374151', marginBottom: '1rem' }}>
                            Q{index + 1}. {q.question}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {q.options.map((option, optIndex) => (
                                <label
                                    key={optIndex}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        border: answers[q.id] === optIndex ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                        background: answers[q.id] === optIndex ? '#dbeafe' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        checked={answers[q.id] === optIndex}
                                        onChange={() => handleAnswerChange(q.id, optIndex)}
                                        style={{ marginRight: '1rem' }}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    style={{
                        padding: '1rem 3rem',
                        fontSize: '1.1rem',
                        background: Object.keys(answers).length === questions.length ? '#10b981' : '#2563eb'
                    }}
                >
                    ✅ Submit Test ({Object.keys(answers).length}/{questions.length} answered)
                </button>
            </div>
        </div>
    );
};

export default TakeTest;
