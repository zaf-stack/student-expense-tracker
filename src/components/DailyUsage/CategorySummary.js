import React from 'react';
import {
    Typography,
    Box,
    Grid,
    Paper,
    LinearProgress
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme, useMediaQuery } from '@mui/material';



const categories = {
    grocery: 'Grocery',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    snacks: 'Snacks',
    outside_food: 'Outside Food'
};

// const COLORS = ['#1976d2', '#2196f3', '#64b5f6', '#90caf9', '#bbdefb'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function CategorySummary({ expenses, }) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Calculate category-wise totals
    const categoryTotals = expenses.reduce((acc, expense) => {
        const category = categories[expense.category] || expense.category;
        acc[category] = (acc[category] || 0) + expense.amount;
        return acc;
    }, {});

    // Convert to array for charts
    const chartData = Object.entries(categoryTotals).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
    }));

    const totalExpense = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Expense Distribution
            </Typography>

            <Grid container spacing={2}>
                {/* Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        p: 2,
                        height: isMobile ? 250 : 300
                    }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={2}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `₹${value.toFixed(2)}`}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Category Breakdown */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Category Breakdown
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {chartData.map((category) => (
                                <Box key={category.name} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>{category.name}</Typography>
                                        <Typography>₹{category.value.toFixed(2)}</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(category.value / totalExpense) * 100}
                                        sx={{
                                            height: 8,
                                            borderRadius: 5,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: category.color
                                            }
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}