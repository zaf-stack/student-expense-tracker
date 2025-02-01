import React from 'react';
import { Typography } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Jan', expenses: 4000 },
    { name: 'Feb', expenses: 3000 },
    { name: 'Mar', expenses: 5000 },
    { name: 'Apr', expenses: 2780 },
    { name: 'May', expenses: 1890 },
    { name: 'Jun', expenses: 2390 },
];

export default function MonthlyTrend() {
    return (
        <>
            <Typography variant="h6" className="mb-4">
                Monthly Expense Trend
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#8884d8"
                            name="Total Expenses"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}