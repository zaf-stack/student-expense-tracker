import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, IconButton, Switch, useMediaQuery, useTheme } from '@mui/material';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import CategorySummary from './CategorySummary';
import EditExpenseModal from './EditExpenseModal';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import { DeleteOutline, Money } from '@mui/icons-material';

const STORAGE_KEY = 'dailyExpenses';

export default function DailyUsagePage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [expenses, setExpenses] = useState(() => {
        const savedExpenses = localStorage.getItem(STORAGE_KEY);
        return savedExpenses ? JSON.parse(savedExpenses) : [];
    });

    const [selectedExpense, setSelectedExpense] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showExpenseTable, setShowExpenseTable] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }, [expenses]);

    const handleAddExpense = (newExpense) => {
        const expenseWithId = {
            ...newExpense,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        setExpenses(prevExpenses => [...prevExpenses, expenseWithId]);
        toast.success("Expense Added Successfully! ✅");
    };

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

    const handleEditExpense = (updatedExpense) => {
        setExpenses(prevExpenses =>
            prevExpenses.map(expense =>
                expense.id === updatedExpense.id
                    ? { ...updatedExpense, updatedAt: new Date().toISOString() }
                    : expense
            )
        );
        toast.info("Expense Updated Successfully! 🔄");
        setEditModalOpen(false);
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
                {/* Recent Transactions Component - Only on Mobile */}

                {isMobile && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Recent Transactions
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                Show Full Table <Switch checked={showExpenseTable} onChange={() => setShowExpenseTable(!showExpenseTable)} />
                            </Typography>
                            {expenses
                                .slice() // Create a copy of the array
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date (newest first)
                                .slice(0, 4) // Take the first 4 items
                                .map((expense) => (
                                    <Paper key={expense.id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
                                        <IconButton>
                                            <Money color="action" />
                                        </IconButton>
                                        <div>
                                            <Typography variant="body1" fontWeight="bold">
                                                ₹{expense.amount}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {expense.description || 'No description'}
                                            </Typography>
                                        </div>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(expense.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <IconButton onClick={() => { setSelectedExpense(expense); setEditModalOpen(true); }}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteExpense(expense.id)}>
                                            <DeleteOutline color="error" />
                                        </IconButton>
                                    </Paper>
                                ))}

                        </Paper>
                    </Grid>
                )}


                <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{ p: isMobile ? 2 : 3 }}>
                        <CategorySummary expenses={expenses} />
                    </Paper>
                </Grid>


                {/* Show Material Table only if toggle is ON with Scrollable Container */}
                {(showExpenseTable || !isMobile) && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: isMobile ? 2 : 3, overflowX: 'auto', maxWidth: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Expense Listing
                            </Typography>
                            <div style={{ width: '100%', overflowX: 'auto' }}>
                                <ExpenseList
                                    expenses={expenses}
                                    onDelete={handleDeleteExpense}
                                    onEdit={handleEditExpense}
                                />
                            </div>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Edit Expense Modal */}
            <EditExpenseModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                expense={selectedExpense}
                onSave={handleEditExpense}
            />
        </div>
    );
}
