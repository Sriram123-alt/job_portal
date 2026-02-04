import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyApplications from './pages/MyApplications'
import Home from './pages/Home'
import ResumeUpload from './pages/ResumeUpload'
import TakeTest from './pages/TakeTest'
import Profile from './pages/Profile'
import JobDetails from './pages/JobDetails'
import { AuthProvider, useAuth } from './context/AuthContext'

if (import.meta.env.VITE_API_URL) {
    // Remove trailing slash and '/api' if present to avoid double '/api/api'
    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '').replace(/\/api$/, '');
    axios.defaults.baseURL = apiUrl;
}

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

import { useLocation } from 'react-router-dom';

function AppRoutes() {
    const location = useLocation();
    const hideNavbar = ['/login', '/register'].includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Default to Seeker Role */}
                    <Route path="/login" element={<Login role="SEEKER" />} />
                    <Route path="/register" element={<Register role="SEEKER" />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/job/:id" element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    } />

                    <Route path="/resume" element={
                        <ProtectedRoute>
                            <ResumeUpload />
                        </ProtectedRoute>
                    } />

                    <Route path="/my-applications" element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    } />

                    <Route path="/test/:applicationId" element={
                        <ProtectedRoute>
                            <TakeTest />
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
