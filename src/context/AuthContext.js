// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

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

    // const signup = (email, password) => {
    //     const hashedPassword = bcrypt.hashSync(password, 10);
    //     const newUser = { email, password: hashedPassword };

    //     const users = JSON.parse(localStorage.getItem('users') || '[]');
    //     localStorage.setItem('users', JSON.stringify([...users, newUser]));

    //     localStorage.setItem('currentUser', JSON.stringify(newUser));
    //     setUser(newUser);
    //     navigate('/');
    // };

    // const login = (email, password) => {
    //     const users = JSON.parse(localStorage.getItem('users') || '[]');
    //     const foundUser = users.find(u => u.email === email);

    //     if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
    //         localStorage.setItem('currentUser', JSON.stringify(foundUser));
    //         setUser(foundUser);
    //         // ✅ Redirect to previous path or home
    //         const redirectPath = localStorage.getItem('redirectPath') || '/';
    //         navigate(redirectPath);
    //         localStorage.removeItem('redirectPath');
    //     } else {
    //         throw new Error('Invalid credentials');
    //     }
    // };


    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email);

        if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
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
        const hashedPassword = bcrypt.hashSync(password, 10);
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

        if (!bcrypt.compareSync(currentPassword, userRecord.password)) {
            throw new Error('Current password is incorrect');
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        users[userIndex].password = hashedNewPassword;

        localStorage.setItem('users', JSON.stringify(users));
        // We don't store password in currentUser ideally, but if it is there update it or leave it. 
        // Our signup does: {name, email, password: hash}. So currentUser has hash.
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