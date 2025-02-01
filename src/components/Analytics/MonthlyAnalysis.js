import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonthlyAnalysis({ expenses }) {
    const monthlyData = processMonthlyData(expenses);

    return (
        <div>
            <Paper className="p-4 mb-4">
                <Typography variant="h6" gutterBottom>
                    Monthly Expense Comparison
                </Typography>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="expenses" name="Current Year" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Paper>
        </div>
    );
}

function processMonthlyData(expenses) {
    const monthlyTotals = {};

    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }

        monthlyTotals[month] += expense.amount;
    });

    return Object.entries(monthlyTotals).map(([month, total]) => ({
        month,
        expenses: total
    }));
}