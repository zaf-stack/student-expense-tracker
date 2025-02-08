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
    useTheme,
    BottomNavigation,
    BottomNavigationAction,
    Paper
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as DailyIcon,
    Person as PersonalIcon,
    AccountBalance as EMIIcon,
    Menu as MenuIcon,
    ChevronLeft as CloseIcon,
    AccountBalanceWallet,
    AddCircleOutline,
    MoreHoriz,
    Analytics,
    Home,
    AccountCircle
} from '@mui/icons-material';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;
const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: '/' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Daily Usage', icon: <DailyIcon />, path: '/daily-usage' },
    { text: 'Budget Planning', icon: <AccountBalanceWallet />, path: '/budget-planning' },
    { text: 'Personal Usage', icon: <PersonalIcon />, path: '/personal-usage' },
    { text: 'EMI Tracker', icon: <EMIIcon />, path: '/emi-tracker' },
];

const mobileItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Analysis', icon: <Analytics />, path: '/analytics' },
    { text: 'Add', icon: <AddCircleOutline fontSize="large" color='primary' />, path: '/daily-usage' },
    { text: 'Advisor', icon: <FaceRetouchingNaturalIcon />, path: '/budget-planning' },
    { text: 'More', icon: <MoreHoriz />, path: null },
];

export default function Layout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileNavValue, setMobileNavValue] = useState(0);
    const [addExpenseClicked, setAddExpenseClicked] = useState(false);

    const handleMobileNavChange = (event, newValue) => {
        if (mobileItems[newValue].path === null) {
            setIsSidebarOpen(true);
            return;
        }
        setMobileNavValue(newValue);
        navigate(mobileItems[newValue].path);
    };

    // ✅ Handle + icon click
    const handleAddExpenseClick = () => {
        setAddExpenseClicked(prev => !prev); // Toggle state to trigger useEffect in DashboardPage
    };

    useEffect(() => {
        const currentIndex = mobileItems.findIndex(item => item.path === location.pathname);
        if (currentIndex > -1) setMobileNavValue(currentIndex);
    }, [location]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Desktop App Bar */}
            <AppBar position="sticky" sx={{ display: { xs: 'none', md: 'block' }, zIndex: 1200 }}>
                <Toolbar>
                    <IconButton
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

            {/* Mobile App Bar */}
            <AppBar position="sticky" sx={{
                display: { xs: 'block', md: 'none' },
                zIndex: 1200,
                width: '100%', // Ensure it takes full width
                maxWidth: '100%', // Prevent overflow
                overflowX: 'hidden' // Hide horizontal overflow
            }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {mobileItems[mobileNavValue].text}
                    </Typography>
                    {user && (
                        <IconButton color="inherit" onClick={logout}>
                            Logout ({user.email})
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                marginLeft: { md: isSidebarOpen ? `${drawerWidth}px` : 0 },
                transition: 'margin-left 0.3s',
                pt: 2
            }}>
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <Box sx={{
                        width: drawerWidth,
                        position: 'fixed',
                        left: 0,
                        height: '100%',
                        bgcolor: 'background.paper',
                        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
                    }}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem
                                    button
                                    key={item.text}
                                    component={Link}
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        bgcolor: location.pathname === item.path ? '#e3f2fd' : 'inherit',
                                        '&:hover': { bgcolor: '#f5f5f5' }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Mobile Sidebar */}
                <AnimatePresence>
                    {isMobile && isSidebarOpen && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween' }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '70%',
                                zIndex: 1300,
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: theme.shadows[16]
                            }}
                        >
                            <Box sx={{ pt: 8, px: 2 }}>
                                <List>
                                    {menuItems.map((item) => (
                                        <ListItem
                                            button
                                            key={item.text}
                                            component={Link}
                                            to={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            sx={{
                                                borderRadius: 2,
                                                mb: 1,
                                                bgcolor: location.pathname === item.path ? '#e3f2fd' : 'inherit'
                                            }}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Area */}
                <Box component="main" sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 },
                    width: { md: `calc(100% - ${drawerWidth}px)` }
                }}>
                    {children}
                    <Outlet />
                </Box>
            </Box>

            {/* Mobile Bottom Navigation */}
            {/* {isMobile && (
                <Paper sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={mobileNavValue}
                        onChange={handleMobileNavChange}
                    >
                        {mobileItems.map((item, index) => (
                            <BottomNavigationAction
                                key={item.text}
                                label={item.text}
                                icon={item.icon}
                                sx={{
                                    '& .MuiBottomNavigationAction-label': {
                                        fontSize: '0.75rem'
                                    }
                                }}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            )} */}
            {isMobile && (
                <Paper sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={mobileNavValue}
                        onChange={handleMobileNavChange}
                    >
                        {mobileItems.map((item, index) => (
                            <BottomNavigationAction
                                key={item.text}
                                label={item.text}
                                icon={item.icon}
                                onClick={item.text === 'Add' ? handleAddExpenseClick : null} // ✅ Handle + icon click
                                sx={{
                                    '& .MuiBottomNavigationAction-label': {
                                        fontSize: '0.75rem'
                                    }
                                }}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            )}

            {/* Pass addExpenseClicked state to DashboardPage */}
            {React.isValidElement(children)
                ? React.cloneElement(children, { onAddExpenseClick: addExpenseClicked })
                : children}

        </Box>
    );
}