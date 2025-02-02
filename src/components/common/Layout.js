// src/components/common/Layout.js
import React, { useState } from 'react';
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
    IconButton
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
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar with Toggle Button */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
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
                            zIndex: 1200
                        }}
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
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
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
                    marginLeft: isSidebarOpen ? `${drawerWidth}px` : 0,
                    transition: 'margin-left 0.3s ease-in-out'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}