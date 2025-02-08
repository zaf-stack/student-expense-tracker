import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, user } = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //     user && navigate('/');
    // }, [user]);

    const onSubmit = async (data) => {
        try {
            await signup(data.email, data.password);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4">Sign Up</Typography>
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
                        Sign Up
                    </Button>
                </form>
                <Typography sx={{ mt: 2 }}>
                    Already have an account? <Link to="/login">Login</Link>
                </Typography>
            </Box>
        </Container>
    );
}