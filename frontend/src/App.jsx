import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import JobCreate from './pages/JobCreate'
import MyApplications from './pages/MyApplications'
import Home from './pages/Home'
import ResumeUpload from './pages/ResumeUpload'
import JobApplications from './pages/JobApplications'
import { AuthProvider, useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role && user.role !== 'ADMIN') {
        if (role === 'RECRUITER' && user.role !== 'RECRUITER') return <Navigate to="/" />;
    }
    return children;
};

import { useLocation } from 'react-router-dom';

function AppRoutes() {
    const location = useLocation();
    const hideNavbar = ['/resume', '/login', '/register'].includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/resume" element={
                        <ProtectedRoute role="SEEKER">
                            <ResumeUpload />
                        </ProtectedRoute>
                    } />
                    <Route path="/create-job" element={
                        <ProtectedRoute role="RECRUITER">
                            <JobCreate />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-applications" element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    } />
                    <Route path="/job/:jobId/applications" element={
                        <ProtectedRoute role="RECRUITER">
                            <JobApplications />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
                <ToastContainer />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
