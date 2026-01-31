import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Avatar,
    Grid,
    Paper,
    IconButton,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import { PhotoCamera, DeleteForever, Save, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

export default function ProfilePage() {
    const { user, updateProfile, changePassword, deleteAccount } = useAuth();

    // State for Profile Update
    const [name, setName] = useState(user?.name || '');
    const [photo, setPhoto] = useState(user?.photo || '');

    // State for Password Change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);

    // ✅ Visibility States
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle Photo Upload with Validation
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // ✅ Check File Size (Limit 2MB)
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Please select an image smaller than 2MB.',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save Profile Changes
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await updateProfile({ name, photo });
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your profile details have been saved successfully.',
                confirmButtonColor: '#2563EB'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message,
                confirmButtonColor: '#d33'
            });
        }
        setLoading(false);
    };

    // Change Password
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Swal.fire('Error', 'New passwords do not match!', 'error');
            return;
        }
        setLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            Swal.fire({
                icon: 'success',
                title: 'Password Changed!',
                text: 'Your password has been updated securely.',
                confirmButtonColor: '#2563EB'
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error.message,
                confirmButtonColor: '#d33'
            });
        }
        setLoading(false);
    };

    // Delete Account
    const handleDeleteAccount = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! All your data will be lost forever.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAccount();
                Swal.fire(
                    'Deleted!',
                    'Your account has been deleted.',
                    'success'
                );
            }
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ position: 'relative', mr: 4 }}>
                            <Avatar
                                src={photo}
                                alt={name}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                                    border: '4px solid white'
                                }}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="icon-button-file"
                                type="file"
                                onChange={handlePhotoChange}
                            />
                            <label htmlFor="icon-button-file">
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="span"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: '#f5f5f5' },
                                        boxShadow: 2
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1e293b' }}>
                                Edit Profile
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Update your photo and personal details
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Personal Details */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#334155' }}>
                                Personal Information
                            </Typography>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"
                                sx={{ mb: 3 }}
                                InputProps={{ sx: { borderRadius: '12px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                value={user?.email}
                                disabled
                                variant="outlined"
                                sx={{ mb: 3 }}
                                InputProps={{ sx: { borderRadius: '12px', bgcolor: '#f1f5f9' } }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSaveProfile}
                                disabled={loading}
                                sx={{
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    py: 1.5,
                                    px: 4,
                                    bgcolor: '#2563EB',
                                    '&:hover': { bgcolor: '#1d4ed8' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                            </Button>
                        </Grid>

                        {/* Security */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#334155' }}>
                                Security
                            </Typography>
                            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <TextField
                                    fullWidth
                                    label="Current Password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    size="small"
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        sx: { borderRadius: '8px', bgcolor: 'white' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    edge="end"
                                                >
                                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    size="small"
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        sx: { borderRadius: '8px', bgcolor: 'white' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    edge="end"
                                                >
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    size="small"
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        sx: { borderRadius: '8px', bgcolor: 'white' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<Lock />}
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                    fullWidth
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: '#2563EB',
                                        borderColor: '#2563EB'
                                    }}
                                >
                                    Change Password
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Danger Zone */}
                    <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 700, mb: 1 }}>
                            Danger Zone
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography variant="body2" color="textSecondary">
                                Once you delete your account, there is no going back. Please be certain.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<DeleteForever />}
                                onClick={handleDeleteAccount}
                                color="error"
                                sx={{
                                    mt: { xs: 2, sm: 0 },
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: '#ef4444',
                                    '&:hover': { bgcolor: '#dc2626' }
                                }}
                            >
                                Delete Account
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
}
