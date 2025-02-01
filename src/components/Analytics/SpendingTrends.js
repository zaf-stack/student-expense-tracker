import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SpendingTrends({ expenses }) {
    const dailyData = processDailyData(expenses);

    return (
        <div>
            <Paper className="p-4 mb-4">
                <Typography variant="h6" gutterBottom>
                    Spending Patterns
                </Typography>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="daily" name="Daily Spending" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Paper>
        </div>
    );
}

function processDailyData(expenses) {
    const dailyTotals = {};

    expenses.forEach(expense => {
        const date = expense.date;

        if (!dailyTotals[date]) {
            dailyTotals[date] = 0;
        }

        dailyTotals[date] += expense.amount;
    });

    return Object.entries(dailyTotals).map(([date, total]) => ({
        date,
        daily: total
    }));
}