// src/components/common/Layout.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as DailyIcon,
    Person as PersonalIcon,
    AccountBalance as EMIIcon,
    Menu as MenuIcon,
    ChevronLeft as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Analytics', icon: <DashboardIcon />, path: '/analytics' },
    { text: 'Daily Usage', icon: <DailyIcon />, path: '/daily-usage' },
    { text: 'Personal Usage', icon: <PersonalIcon />, path: '/personal-usage' },
    { text: 'EMI Tracker', icon: <EMIIcon />, path: '/emi-tracker' },
];

const sidebarVariants = {
    open: { width: drawerWidth, opacity: 1 },
    closed: { width: 0, opacity: 0 }
};

export default function Layout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Mobile: Closed by default
    const toggleButtonRef = useRef(null); // Ref for toggle button

    // Toggle sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Close sidebar on mobile when a link is clicked
    const handleLinkClick = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    // Close sidebar when clicking outside (mobile only)
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Check if click is NOT on sidebar and NOT on toggle button
            if (
                isMobile &&
                isSidebarOpen &&
                !e.target.closest('.sidebar') &&
                !e.target.closest('.toggle-button')
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile, isSidebarOpen]);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar with Toggle Button */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        className="toggle-button" // Add class for reference
                        ref={toggleButtonRef}
                        color="inherit"
                        edge="start"
                        onClick={toggleSidebar}
                        sx={{ mr: 2 }}
                    >
                        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Student Expense Manager
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Animated Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial="open"
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                        transition={{ type: 'spring', stiffness: 800, damping: 80 }}
                        style={{
                            position: 'fixed',
                            height: '100vh',
                            overflowX: 'hidden',
                            zIndex: 1200,
                            pointerEvents: 'auto' // Enable clicks on sidebar
                        }}
                        className="sidebar" // For click-outside detection
                    >
                        <Drawer
                            variant="persistent"
                            open={isSidebarOpen}
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxSizing: 'border-box',
                                },
                            }}
                        >
                            <Toolbar />
                            <List>
                                {menuItems.map((item) => (
                                    <ListItem
                                        button
                                        key={item.text}
                                        component={Link}
                                        to={item.path}
                                        selected={location.pathname === item.path}
                                        onClick={handleLinkClick}
                                        sx={{
                                            backgroundColor: location.pathname === item.path ? '#e3f2fd' : 'inherit',
                                            '&:hover': { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                                color: location.pathname === item.path ? '#1976d2' : 'inherit'
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Drawer>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: isSidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
                    transition: 'margin-left 0.3s ease-in-out'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}