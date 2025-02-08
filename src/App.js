import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout';
import DashboardPage from './components/Dashboard/DashboardPage';
import DailyUsagePage from './components/DailyUsage/DailyUsagePage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BudgetPlanningPage from './components/BudgetPlanning/BudgetPlanningPage';
// import EditorTrackerPage from './components/EditorTracker/EditorTrackerPage';

// Extra Pages
const PersonalUsage = () => <div className="p-4">Personal Usage Coming Soon</div>;
const EMITracker = () => <div className="p-4">EMI Tracker Coming Soon</div>;

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc2626' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes (Login & Signup without Sidebar) */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Protected Routes (Dashboard + Sidebar) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/daily-usage" element={<DailyUsagePage />} />
                {/* <Route path="/editor-tracker" element={<EditorTrackerPage />} /> */}
                <Route path="/budget-planning" element={<BudgetPlanningPage />} />
                <Route path="/personal-usage" element={<PersonalUsage />} />
                <Route path="/emi-tracker" element={<EMITracker />} />
              </Route>
            </Route>

            {/* Default Redirect */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </AuthProvider>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

/* ✅ PublicRoute: No Sidebar for Login & Signup */
// const PublicRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? <Navigate to="/" replace /> : children;
// };

/* ✅ ProtectedRoute: Only for Logged-In Users */
// const ProtectedRoute = () => {
//   const { user } = useAuth();
//   return user ? <Outlet /> : <Navigate to="/login" replace />;
// };

/* ✅ PublicRoute: No Sidebar for Login & Signup */
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    // ✅ Redirect to home or saved path
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    localStorage.removeItem('redirectPath'); // Clear after use
    return <Navigate to={redirectPath} replace />;
  }

  return children; // Allow access to public routes
};

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // ✅ Save the current path for redirect after login
      localStorage.setItem('redirectPath', location.pathname);
      navigate('/login');
    }
  }, [user, location, navigate]);

  return user ? <Outlet /> : null; // Render children only if user exists
};

export default App;
