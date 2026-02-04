import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import JobCreate from './pages/JobCreate'
import Home from './pages/Home'
import JobApplications from './pages/JobApplications'
import Profile from './pages/Profile'
import JobDetails from './pages/JobDetails'
import { AuthProvider, useAuth } from './context/AuthContext'

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

                    {/* Default to Recruiter Role */}
                    <Route path="/login" element={<Login role="RECRUITER" />} />
                    <Route path="/register" element={<Register role="RECRUITER" />} />

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

                    <Route path="/create-job" element={
                        <ProtectedRoute>
                            <JobCreate />
                        </ProtectedRoute>
                    } />



                    <Route path="/job/:jobId/applications" element={
                        <ProtectedRoute>
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
