import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import {
    AccountBalance as BalanceIcon,
    TrendingUp as BudgetIcon,
    Savings as SavingsIcon
} from '@mui/icons-material';

const OverviewCard = ({ title, value, icon, color }) => (
    <Paper className="p-4 h-full">
        <div className="flex items-center justify-between">
            <div>
                <Typography variant="subtitle2" color="textSecondary">
                    {title}
                </Typography>
                <Typography variant="h4" className="mt-2">
                    ₹{value}
                </Typography>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
    </Paper>
);

export default function OverviewCards({ totalExpenses, monthlyBudget }) {
    const total = Number(totalExpenses) || 0; // Ensure totalExpenses is a number
    const budget = Number(monthlyBudget) || 0; // Ensure monthlyBudget is a number
    const savings = budget - total;
    // const savings = monthlyBudget - totalExpenses;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <OverviewCard
                    title="Total Expenses"
                    value={total.toFixed(2)}
                    icon={<BalanceIcon className="text-white" />}
                    color="bg-blue-500"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <OverviewCard
                    title="Monthly Budget"
                    value={budget.toFixed(2)}
                    icon={<BudgetIcon className="text-white" />}
                    color="bg-green-500"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <OverviewCard
                    title="Savings"
                    value={savings.toFixed(2)}
                    icon={<SavingsIcon className="text-white" />}
                    color="bg-purple-500"
                />
            </Grid>
        </Grid>
    );
}