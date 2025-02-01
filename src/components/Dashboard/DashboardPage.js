import React from 'react';
import { Grid, Paper } from '@mui/material';
import OverviewCards from './OverviewCards';
import RecentTransactions from './RecentTransactions';
import ExpenseDistribution from './ExpenseDistribution';
import MonthlyTrend from './MonthlyTrend';

export default function DashboardPage() {
    return (
        <div className="p-4">
            <Grid container spacing={3}>
                {/* Overview Cards */}
                <Grid item xs={12}>
                    <OverviewCards />
                </Grid>

                {/* Charts & Recent Transactions */}
                <Grid item xs={12} md={8}>
                    <Paper className="p-4 mb-4">
                        <MonthlyTrend />
                    </Paper>
                    <Paper className="p-4">
                        <ExpenseDistribution />
                    </Paper>
                </Grid>

                {/* Recent Transactions List */}
                <Grid item xs={12} md={4}>
                    <Paper className="p-4" style={{ height: '600px', overflowY: 'auto' }}>
                        <RecentTransactions />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}