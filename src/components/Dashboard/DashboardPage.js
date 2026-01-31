import React, { useState, useEffect } from 'react';
import { Grid, Paper, Button, Modal, Box, Typography, TextField, useTheme, useMediaQuery } from '@mui/material';
import OverviewCards from './OverviewCards';
import RecentTransactions from './RecentTransactions';
import ExpenseDistribution from './ExpenseDistribution';
import MonthlyTrend from './MonthlyTrend';
import AddExpenseForm from '../DailyUsage/AddExpenseForm'; // ✅ Expense Form Import
import { toast, ToastContainer } from "react-toastify"; // ✅ Toastify Import
import "react-toastify/dist/ReactToastify.css";
import { Add as AddIcon } from '@mui/icons-material';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORIES = {
    grocery: 'Grocery',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    snacks: 'Snacks',
    outside_food: 'Outside Food'
};

export default function DashboardPage({ onAddExpenseClick }) {
    const [dashboardData, setDashboardData] = useState({
        totalExpenses: 0,
        monthlyTrend: [],
        categoryDistribution: [],
        recentTransactions: []
    });

    const [open, setOpen] = useState(false); // ✅ Modal State
    const [resetForm, setResetForm] = useState(false); // ✅ Track if form should be reset

    const [monthlyBudget, setMonthlyBudget] = useState(() => {
        const saved = localStorage.getItem('monthlyBudget');
        return saved ? Number(saved) : 20000;
    });
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false); // ✅ Budget Modal State
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // ✅ Handle Add Expense from Navbar (Mobile)
    useEffect(() => {
        if (onAddExpenseClick) {
            setOpen(true);
            setResetForm(false);
        }
    }, [onAddExpenseClick]);

    useEffect(() => {
        const fetchExpenses = () => {
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
        };

        fetchExpenses();
        // Polling to keep mostly in sync if other tabs change or navigation back/forth
        // Simple interval for now, or could use context-based refresh trigger
        const interval = setInterval(fetchExpenses, 2000);
        return () => clearInterval(interval);

    }, []);


    // ✅ Add Budget Modal Style
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };

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

        // State updates will happen via the useEffect interval/refresh pattern or can act immediatley
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
        <Box sx={{ flexGrow: 1 }}>
            <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Toastify Container */}

            {/* Header Section with Button Alignment */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, mt: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setOpen(true);
                        setResetForm(false);
                    }}
                    sx={{
                        backgroundColor: '#2563EB',
                        borderRadius: '50px', // More rounded
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1.2rem', // Larger text
                        px: 6, // Wider padding
                        py: 1.5, // Taller button
                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4), 0 4px 6px -2px rgba(37, 99, 235, 0.2)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            backgroundColor: '#1d4ed8',
                            transform: 'scale(1.05)'
                        }
                    }}
                >
                    Add Expense
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Overview Cards Row */}
                <Grid item xs={12}>
                    <OverviewCards
                        totalExpenses={dashboardData.totalExpenses}
                        monthlyBudget={monthlyBudget}
                        onEditBudget={() => setIsBudgetModalOpen(true)} // ✅ Pass edit handler
                    />
                </Grid>

                {/* ✅ Add Budget Modal */}
                <Modal
                    open={isBudgetModalOpen}
                    onClose={() => setIsBudgetModalOpen(false)}
                >
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Edit Monthly Budget
                        </Typography>
                        <TextField
                            autoFocus
                            fullWidth
                            label="New Budget"
                            type="number"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                localStorage.setItem('monthlyBudget', monthlyBudget.toString());
                                setIsBudgetModalOpen(false);
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Modal>

                {/* Charts Area */}
                <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <MonthlyTrend data={dashboardData.monthlyTrend} />
                    </Paper>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <ExpenseDistribution data={dashboardData.categoryDistribution} />
                    </Paper>
                </Grid>

                {/* Recent Transactions Area */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        // Dynamic height: fit content but minimal height to look balanced, scroll if too long
                        maxHeight: '700px',
                        overflowY: 'auto'
                    }}>
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
                    width: isMobile ? '90%' : 400, // Responsive Width
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3
                }}>
                    <AddExpenseForm onSubmit={handleAddExpense} resetForm={resetForm} />

                    <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        sx={{ mt: 2, borderRadius: '12px' }}
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
