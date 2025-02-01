import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Tabs, Tab } from '@mui/material';
import { AssessmentOutlined, TrendingUp } from '@mui/icons-material';
import MonthlyAnalysis from './MonthlyAnalysis';
import SpendingTrends from './SpendingTrends';
import ExportOptions from './ExportOptions';

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const STORAGE_KEY = 'dailyExpenses';
    const expenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div className="p-4">
            <Box className="mb-4 flex justify-between items-center">
                <Typography variant="h5" component="h1">
                    Analytics & Reporting
                </Typography>
                <ExportOptions data={expenses} title="Expense Analysis Report" />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
                                <Tab icon={<AssessmentOutlined />} iconPosition="start" label="Monthly Analysis" />
                                <Tab icon={<TrendingUp />} iconPosition="start" label="Spending Trends" />
                            </Tabs>
                        </Box>

                        {activeTab === 0 && <MonthlyAnalysis expenses={expenses} />}
                        {activeTab === 1 && <SpendingTrends expenses={expenses} />}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}