import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import OverviewCards from './OverviewCards';
import RecentTransactions from './RecentTransactions';
import ExpenseDistribution from './ExpenseDistribution';
import MonthlyTrend from './MonthlyTrend';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORIES = {
    grocery: 'Grocery',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    snacks: 'Snacks',
    outside_food: 'Outside Food'
};

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalExpenses: 0,
        monthlyTrend: [],
        categoryDistribution: [],
        recentTransactions: []
    });

    // Fetch and process data
    useEffect(() => {
        const expenses = JSON.parse(localStorage.getItem('dailyExpenses') || '[]');

        // 1. Total Expenses Calculation
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // 2. Monthly Trend Data
        const monthlyData = Array(12).fill(0).map((_, index) => ({
            name: MONTHS[index],
            expenses: 0
        }));

        expenses.forEach(expense => {
            const month = new Date(expense.date).getMonth();
            monthlyData[month].expenses += expense.amount;
        });

        // 3. Category Distribution
        const categoryData = Object.keys(CATEGORIES).map(category => ({
            name: CATEGORIES[category],
            value: expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0)
        }));

        // 4. Recent Transactions (Last 5)
        const recentTransactions = expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        setDashboardData({
            totalExpenses,
            monthlyTrend: monthlyData,
            categoryDistribution: categoryData,
            recentTransactions
        });
    }, []);

    return (
        <div className="p-4">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <OverviewCards
                        totalExpenses={dashboardData.totalExpenses}
                        monthlyBudget={20000} // Set your budget here
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper className="p-4 mb-4">
                        <MonthlyTrend data={dashboardData.monthlyTrend} />
                    </Paper>
                    <Paper className="p-4">
                        <ExpenseDistribution data={dashboardData.categoryDistribution} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper className="p-4" style={{ height: '600px', overflowY: 'auto' }}>
                        <RecentTransactions transactions={dashboardData.recentTransactions} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}