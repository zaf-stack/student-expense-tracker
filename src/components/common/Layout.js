import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    IconButton,
    Button,
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
import { useAuth } from '../../context/AuthContext';

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
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLinkClick = () => isMobile && setIsSidebarOpen(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobile && isSidebarOpen &&
                !e.target.closest('.sidebar') &&
                !e.target.closest('.toggle-button')) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMobile, isSidebarOpen]);

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        className="toggle-button"
                        color="inherit"
                        edge="start"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        sx={{ mr: 2 }}
                    >
                        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Student Expense Manager
                    </Typography>
                    {user && (
                        <Button color="inherit" onClick={logout}>
                            Logout ({user.email})
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={isMobile ? "closed" : "open"}
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                        transition={{ type: 'spring', stiffness: 800, damping: 80 }}
                        className="sidebar"
                        style={{
                            position: 'fixed',
                            height: '100vh',
                            overflowX: 'hidden',
                            zIndex: 1200,
                            pointerEvents: 'auto',
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: theme.shadows[4]
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
                    </motion.div>
                )}
            </AnimatePresence>

            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                marginLeft: isSidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
                transition: 'margin-left 0.3s ease-in-out'
            }}>
                <Toolbar />
                {children}
                <Outlet />
            </Box>
        </Box>
    );
}