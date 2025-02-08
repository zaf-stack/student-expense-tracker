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

    const signup = (email, password) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = { email, password: hashedPassword };

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

    return (
        <AuthContext.Provider value={{ user, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);