// src/components/DailyUsage/DailyUsagePage.js
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import CategorySummary from './CategorySummary';

const STORAGE_KEY = 'dailyExpenses';

export default function DailyUsagePage() {
    // Initialize state from localStorage or use empty array
    const [expenses, setExpenses] = useState(() => {
        const savedExpenses = localStorage.getItem(STORAGE_KEY);
        return savedExpenses ? JSON.parse(savedExpenses) : [];
    });

    // Save to localStorage whenever expenses change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }, [expenses]);

    // Handler for adding new expense
    const handleAddExpense = (newExpense) => {
        const expenseWithId = {
            ...newExpense,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        setExpenses(prevExpenses => [...prevExpenses, expenseWithId]);
    };

    // Handler for deleting expense
    const handleDeleteExpense = (id) => {
        setExpenses(prevExpenses =>
            prevExpenses.filter(expense => expense.id !== id)
        );
    };

    // Handler for editing expense
    const handleEditExpense = (updatedExpense) => {
        setExpenses(prevExpenses =>
            prevExpenses.map(expense =>
                expense.id === updatedExpense.id
                    ? { ...updatedExpense, updatedAt: new Date().toISOString() }
                    : expense
            )
        );
    };

    return (
        <div className="p-4">
            <Grid container spacing={3}>
                {/* Add Expense Form */}
                <Grid item xs={12} md={4}>
                    <Paper className="p-4">
                        <AddExpenseForm onSubmit={handleAddExpense} />
                    </Paper>
                </Grid>

                {/* Category Summary */}
                <Grid item xs={12} md={8}>
                    <Paper className="p-4">
                        <CategorySummary expenses={expenses} />
                    </Paper>
                </Grid>

                {/* Expense List */}
                <Grid item xs={12}>
                    <Paper className="p-4">
                        <Typography variant="h6" className="mb-4">
                            Expense Listing
                        </Typography>
                        <ExpenseList
                            expenses={expenses}
                            onDelete={handleDeleteExpense}
                            onEdit={handleEditExpense}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}