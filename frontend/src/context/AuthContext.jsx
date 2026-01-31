import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // 1. Set basic info from token to avoid blocking UI
                // const decoded = jwtDecode(token);

                // 2. Fetch full profile
                const res = await axios.get('/api/profile/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser({ ...res.data, role: res.data.role || localStorage.getItem('role') || 'USER' });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, [token]);

    const login = async (username, password) => {
        const res = await axios.post('/api/auth/signin', { username, password });
        const { accessToken, role } = res.data;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('role', role);
        setToken(accessToken);

        // Fetch user profile to check resume status
        try {
            const profileRes = await axios.get('/api/profile/me', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setUser(profileRes.data);

            // For seekers without resume, force upload
            // For seekers without resume, force upload
            if (role === 'SEEKER') {
                if (!profileRes.data.seekerProfile || !profileRes.data.seekerProfile.resumeUrl) {
                    return '/resume';
                }
                return '/';
            }
        } catch (e) {
            console.error("Profile fetch failed", e);
            const decoded = jwtDecode(accessToken);
            setUser({ username: decoded.sub, role: role });
        }
        return '/dashboard';
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null); // Clear token state on logout
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
