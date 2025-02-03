import React, { useState, useEffect } from 'react';
import { Grid, Paper, Button, Modal, Box } from '@mui/material';
import OverviewCards from './OverviewCards';
import RecentTransactions from './RecentTransactions';
import ExpenseDistribution from './ExpenseDistribution';
import MonthlyTrend from './MonthlyTrend';
import AddExpenseForm from '../DailyUsage/AddExpenseForm'; // ✅ Expense Form Import
import { toast, ToastContainer } from "react-toastify"; // ✅ Toastify Import
import "react-toastify/dist/ReactToastify.css";

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

    const [open, setOpen] = useState(false); // ✅ Modal State
    const [resetForm, setResetForm] = useState(false); // ✅ Track if form should be reset

    useEffect(() => {
        const expenses = JSON.parse(localStorage.getItem('dailyExpenses') || '[]');

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const monthlyData = Array(12).fill(0).map((_, index) => ({
            name: MONTHS[index],
            expenses: 0
        }));

        expenses.forEach(expense => {
            const month = new Date(expense.date).getMonth();
            monthlyData[month].expenses += expense.amount;
        });

        const categoryData = Object.keys(CATEGORIES).map(category => ({
            name: CATEGORIES[category],
            value: expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0)
        }));

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

    // ✅ Function to Add Expense from Dashboard
    const handleAddExpense = (newExpense) => {
        const expenseWithId = {
            ...newExpense,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };

        const expenses = JSON.parse(localStorage.getItem('dailyExpenses') || '[]');
        const updatedExpenses = [...expenses, expenseWithId];

        localStorage.setItem('dailyExpenses', JSON.stringify(updatedExpenses));

        setDashboardData(prev => ({
            ...prev,
            totalExpenses: prev.totalExpenses + expenseWithId.amount,
            recentTransactions: [expenseWithId, ...prev.recentTransactions].slice(0, 5),
        }));

        toast.success("Expense Added Successfully! ✅"); // ✅ Show Success Message

        setResetForm(true); // ✅ Reset form fields
    };

    // ✅ Function to Handle Modal Close and Reset Fields
    const handleCloseModal = () => {
        setOpen(false);
        setResetForm(true); // ✅ Reset fields when modal closes
    };

    return (
        <div className="p-4">
            <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Toastify Container */}

            <Grid container spacing={3}>
                {/* ✅ Button to Open Add Expense Form */}
                <Grid item xs={12} md={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setOpen(true);
                            setResetForm(false); // ✅ Do not reset if opening modal again
                        }}
                        fullWidth
                    >
                        Add Expense
                    </Button>
                </Grid>

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

            {/* ✅ Modal for Add Expense Form */}
            <Modal
                open={open}
                onClose={handleCloseModal}
                aria-labelledby="add-expense-modal"
                aria-describedby="form-to-add-expense"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    {/* ✅ Pass resetForm prop to reset fields on cancel */}
                    <AddExpenseForm onSubmit={handleAddExpense} resetForm={resetForm} />

                    {/* ✅ Cancel Button */}
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
