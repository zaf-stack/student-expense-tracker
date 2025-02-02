// src/components/DailyUsage/ExpenseList.js
import React, { useState } from 'react';
import MaterialTable from '@material-table/core';
import { DeleteOutline, Edit } from '@mui/icons-material';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import EditExpenseModal from './EditExpenseModal';
import { TextField, InputAdornment } from '@mui/material';

const categories = {
    grocery: 'Grocery',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    snacks: 'Snacks',
    outside_food: 'Outside Food'
};

export default function ExpenseList({ expenses, onDelete, onEdit }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    // Columns Configuration
    const columns = [
        {
            title: 'Date',
            field: 'date',
            type: 'date',
            filtering: true,
            headerStyle: { fontWeight: 'bold' },
            customFilterAndSearch: (filter, rowData) => {
                if (!filter) return true;
                const rowDate = new Date(rowData.date);
                const filterDate = new Date(filter);

                // Exact Date Match
                return rowDate.toISOString().split('T')[0] === filter;
            },
            filterComponent: ({ onFilterChanged, columnDef }) => (
                <TextField
                    type="date"
                    onChange={(e) => onFilterChanged(columnDef.tableData.id, e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            )
        },
        {
            title: 'Category',
            field: 'category',
            lookup: categories,
            filterPlaceholder: 'All Categories'
        },
        {
            title: 'Description',
            field: 'description',
            cellStyle: { whiteSpace: 'nowrap' },
            // Global Search Fix
            customFilterAndSearch: (filter, rowData) =>
                rowData.description.toLowerCase().includes(filter.toLowerCase())
        },
        {
            title: 'Amount (₹)',
            field: 'amount',
            type: 'numeric',
            render: rowData => `₹${rowData.amount.toFixed(2)}`,
            align: 'right',
            headerStyle: { textAlign: 'right' },
            customFilterAndSearch: (filter, rowData) => {
                if (!filter) return true;
                if (typeof filter !== 'string') return true;

                // Handle Range (100-500)
                if (filter.includes('-')) {
                    const [min, max] = filter.split('-').map(Number);
                    if (isNaN(min) || isNaN(max)) return true;
                    return rowData.amount >= min && rowData.amount <= max;
                }

                // Handle Exact Amount (100)
                return rowData.amount === Number(filter);
            },
            filterComponent: ({ onFilterChanged, columnDef }) => (
                <TextField
                    placeholder="Ex: 100 or 100-500"
                    onChange={(e) => onFilterChanged(columnDef.tableData.id, e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    fullWidth
                />
            )
        }
    ];

    // Table Actions
    const actions = [
        {
            icon: () => <Edit color="primary" />,
            tooltip: 'Edit Expense',
            onClick: (event, rowData) => handleEditClick(rowData)
        },
        {
            icon: () => <DeleteOutline color="error" />,
            tooltip: 'Delete Expense',
            onClick: (event, rowData) => onDelete(rowData.id)
        }
    ];

    // Edit Handlers
    const handleEditClick = (expense) => {
        setSelectedExpense(expense);
        setEditModalOpen(true);
    };

    const handleEditSave = (updatedExpense) => {
        onEdit(updatedExpense);
        setEditModalOpen(false);
    };

    return (
        <div>
            <MaterialTable
                title="Daily Expenses"
                columns={columns}
                data={expenses}
                actions={actions}
                options={{
                    actionsColumnIndex: -1,
                    filtering: true,
                    sorting: true,
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 20],
                    // searchFieldAlignment: 'left',
                    // searchAutoFocus: true,
                    exportMenu: [
                        {
                            label: 'Export PDF',
                            exportFunc: (cols, datas) => ExportPdf(cols, datas, 'Expenses')
                        },
                        {
                            label: 'Export CSV',
                            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'Expenses')
                        }
                    ],
                    padding: 'dense',
                    headerStyle: {
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontSize: '0.875rem' // Smaller font on mobile
                    },
                    cellStyle: {
                        fontSize: '0.875rem' // Smaller font on mobile
                    },
                    maxBodyHeight: '400px', // Mobile friendly scroll
                    minBodyHeight: '200px',
                    responsive: true // Enable responsive table
                }}
            />

            <EditExpenseModal
                open={editModalOpen}
                expense={selectedExpense}
                onClose={() => setEditModalOpen(false)}
                onSave={handleEditSave}
            />
        </div>
    );
}