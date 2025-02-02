import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout';
import DashboardPage from './components/Dashboard/DashboardPage';
import DailyUsagePage from './components/DailyUsage/DailyUsagePage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



// Pages
const Dashboard = () => <div className="p-4">Dashboard Coming Soon</div>;
// const Analytics = () => <div className="p-4"></div>;
const PersonalUsage = () => <div className="p-4">Personal Usage Coming Soon</div>;
const EMITracker = () => <div className="p-4">EMI Tracker Coming Soon</div>;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc2626',
    },
  },
});

function App({ expenses }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/daily-usage" element={<DailyUsagePage />} />
            <Route path="/personal-usage" element={<PersonalUsage />} />
            <Route path="/emi-tracker" element={<EMITracker />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />

    </ThemeProvider>

  );
}

export default App;