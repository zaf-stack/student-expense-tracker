import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        user && navigate('/');
    }, [user]);

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4">Login</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        {...register('email', { required: 'Email is required' })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
                <Typography sx={{ mt: 2 }}>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </Typography>
            </Box>
        </Container>
    );
}