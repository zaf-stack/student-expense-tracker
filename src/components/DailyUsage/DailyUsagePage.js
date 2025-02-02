// src/components/DailyUsage/DailyUsagePage.js
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import CategorySummary from './CategorySummary';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const STORAGE_KEY = 'dailyExpenses';

export default function DailyUsagePage() {
    // Initialize state from localStorage or use empty array

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));



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

        toast.success("Expense Added Successfully! ✅");
    };
    // ✅ Delete Expense with Confirmation
    const handleDeleteExpense = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
                toast.error("Expense Deleted Successfully! ❌");
            }
        });
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

        toast.info("Expense Updated Successfully! 🔄");
    };

    return (
        <div className="p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={{ p: isMobile ? 2 : 3 }}>
                        <AddExpenseForm onSubmit={handleAddExpense} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{ p: isMobile ? 2 : 3 }}>
                        <CategorySummary expenses={expenses} />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: isMobile ? 2 : 3, overflowX: "auto" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
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