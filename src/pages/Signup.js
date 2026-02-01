import React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, IconButton, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup } = useAuth();
    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmit = async (data) => {
        try {
            await signup(data.name, data.email, data.password);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Abstract Background Blur */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(255,255,255,0) 70%)',
                    top: '-10%',
                    right: '-10%',
                    zIndex: 0,
                    filter: 'blur(60px)',
                    animation: 'float 10s infinite ease-in-out',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(255,255,255,0) 70%)',
                    bottom: '-10%',
                    left: '-10%',
                    zIndex: 0,
                    filter: 'blur(60px)',
                    animation: 'float 8s infinite ease-in-out reverse',
                }}
            />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        sx={{
                            backdropFilter: 'blur(16px) saturate(180%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            borderRadius: '24px',
                            border: '1px solid rgba(209, 213, 219, 0.3)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                            p: 4,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#111827', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Create Account
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                            Join us and manage your expenses effortlessly.
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                fullWidth
                                margin="normal"
                                placeholder="Full Name"
                                variant="outlined"
                                InputProps={{
                                    sx: {
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(243, 244, 246, 0.6)',
                                        '& fieldset': { border: 'none' },
                                        '&:hover': { backgroundColor: 'rgba(243, 244, 246, 1)' },
                                    }
                                }}
                                {...register('name', { required: 'Name is required' })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                placeholder="Email Address"
                                variant="outlined"
                                InputProps={{
                                    sx: {
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(243, 244, 246, 0.6)',
                                        '& fieldset': { border: 'none' },
                                        '&:hover': { backgroundColor: 'rgba(243, 244, 246, 1)' },
                                    }
                                }}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                InputProps={{
                                    sx: {
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(243, 244, 246, 0.6)',
                                        '& fieldset': { border: 'none' },
                                        '&:hover': { backgroundColor: 'rgba(243, 244, 246, 1)' },
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    backgroundColor: '#2563EB',
                                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        backgroundColor: '#1d4ed8',
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </form>
                        <Typography variant="body2" sx={{ color: '#6B7280', mt: 2 }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </motion.div>
            </Container>

            {/* Global Styles for Animations */}
            <style>
                {`
                    @keyframes float {
                        0% { transform: translate(0, 0px); }
                        50% { transform: translate(0, 20px); }
                        100% { transform: translate(0, -0px); }
                    }
                `}
            </style>
        </Box>
    );
}
