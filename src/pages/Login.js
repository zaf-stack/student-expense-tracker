import React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, IconButton, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginError, setLoginError] = React.useState(''); // ✅ New state for error

    const onSubmit = async (data) => {
        setLoginError(''); // Reset error
        try {
            await login(data.email, data.password);
        } catch (error) {
            setLoginError(error.message); // ✅ Set error message instead of alert
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
                    left: '-10%',
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
                    right: '-10%',
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
                            Welcome Back!
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                            Please sign in to continue to your dashboard.
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                {...register('email', { required: 'Email is required' })}
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
                                {...register('password', { required: 'Password is required' })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            {loginError && (
                                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'left', pl: 1 }}>
                                    {loginError}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Link to="#" style={{ color: '#2563EB', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
                                    Forgot Password?
                                </Link>
                            </Box>

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
                                Sign In
                            </Button>
                        </form>
                        <Typography variant="body2" sx={{ color: '#6B7280', mt: 2 }}>
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                                Sign Up
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
