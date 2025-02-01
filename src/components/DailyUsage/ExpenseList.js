// src/components/DailyUsage/ExpenseList.js
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import EditExpenseModal from './EditExpenseModal';

// Sample data - later we'll move this to a proper data management solution
// const sampleExpenses = [
//     {
//         id: 1,
//         date: '2024-01-19',
//         category: 'grocery',
//         description: 'Monthly groceries from DMart',
//         amount: 2500
//     },
//     {
//         id: 2,
//         date: '2024-01-19',
//         category: 'vegetables',
//         description: 'Weekly vegetables',
//         amount: 400
//     },
//     {
//         id: 3,
//         date: '2024-01-18',
//         category: 'outside_food',
//         description: 'Lunch with friends',
//         amount: 350
//     }
// ];

const categories = {
    grocery: 'Grocery',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    snacks: 'Snacks',
    outside_food: 'Outside Food'
};

export default function ExpenseList({ expenses, onDelete, onEdit }) {
    // const [expenses] = useState(sampleExpenses);
    const [filterDate, setFilterDate] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const filteredExpenses = expenses.filter(expense => {
        const dateMatch = !filterDate || expense.date === filterDate;
        const categoryMatch = !filterCategory || expense.category === filterCategory;
        return dateMatch && categoryMatch;
    });

    const handleDelete = (id) => {
        onDelete(id);
    };

    const handleEditClick = (expense) => {
        setSelectedExpense(expense);
        setEditModalOpen(true);
    };

    const handleEditSave = (updatedExpense) => {
        onEdit(updatedExpense);
        setEditModalOpen(false);
        setSelectedExpense(null);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setSelectedExpense(null);
    };

    return (
        <div>


            {/* Filters */}
            <Box className="mb-4 flex gap-4">
                <TextField
                    label="Filter by Date"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl style={{ minWidth: 200 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select
                        value={filterCategory}
                        label="Filter by Category"
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        {Object.entries(categories).map(([id, name]) => (
                            <MenuItem key={id} value={id}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Expense Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExpenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>{expense.date}</TableCell>
                                <TableCell>{categories[expense.category]}</TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell align="right">₹{expense.amount}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEditClick(expense)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(expense.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <EditExpenseModal
                open={editModalOpen}
                expense={selectedExpense}
                onClose={handleEditClose}
                onSave={handleEditSave}
            />
        </div>
    );
}