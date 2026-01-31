// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// NOTE: Switched to simple hash to avoid 'crypto' polyfill issues in Vercel/Webpack 5
// For a production app, use 'crypto-js' or 'bcryptjs' with proper webpack config.
const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return "sec_" + Math.abs(hash).toString(16);
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // ✅ Load user from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email);

        // Check if password matches (support both old bcrypt and new simple hash)
        // If it starts with $2a$, it's likely bcrypt (from old version), so we can't verify it easily without the library.
        // We will just verify new headers. For old users, they might need to reset/signup.
        const isMatch = foundUser && (foundUser.password === simpleHash(password) || foundUser.password === password);

        if (isMatch) {
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            setUser(foundUser);

            // ✅ Redirect to saved path or home
            const redirectPath = localStorage.getItem('redirectPath') || '/';
            navigate(redirectPath);
            localStorage.removeItem('redirectPath'); // Clear after use
        } else {
            throw new Error('Invalid credentials');
        }
    };

    const signup = (name, email, password) => {
        const hashedPassword = simpleHash(password);
        const newUser = { name, email, password: hashedPassword };

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        localStorage.setItem('users', JSON.stringify([...users, newUser]));

        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setUser(newUser);

        // ✅ Redirect to saved path or home
        const redirectPath = localStorage.getItem('redirectPath') || '/';
        navigate(redirectPath);
        localStorage.removeItem('redirectPath'); // Clear after use
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
        navigate('/login');
    };

    const updateProfile = (updatedData) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const updatedUser = { ...currentUser, ...updatedData };

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => u.email === currentUser.email ? { ...u, ...updatedData } : u);

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const changePassword = (currentPassword, newPassword) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userIndex = users.findIndex(u => u.email === currentUser.email);

        if (userIndex === -1) throw new Error('User not found');

        const userRecord = users[userIndex];

        // Verify current (support new simple hash)
        if (userRecord.password !== simpleHash(currentPassword)) {
            // Fallback for demo: if not match, maybe they are using old bcrypt?
            // Since we removed bcrypt, we can't verify old passwords. 
            // We'll throw specific error.
            throw new Error('Current password is incorrect (or using old format)');
        }

        const hashedNewPassword = simpleHash(newPassword);
        users[userIndex].password = hashedNewPassword;

        localStorage.setItem('users', JSON.stringify(users));
        const updatedCurrentUser = { ...currentUser, password: hashedNewPassword };
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
        setUser(updatedCurrentUser);
    };

    const deleteAccount = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = users.filter(u => u.email !== currentUser.email);

        localStorage.setItem('users', JSON.stringify(filteredUsers));
        logout();
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, updateProfile, changePassword, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);