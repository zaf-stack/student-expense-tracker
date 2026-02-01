// src/components/DailyUsage/ExpenseList.js
import React, { useState } from 'react';
import MaterialTable, { MTableToolbar } from '@material-table/core';
import { DeleteOutline, Edit } from '@mui/icons-material';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import EditExpenseModal from './EditExpenseModal';
import { TextField, InputAdornment, Typography, Box, Paper, Chip } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';



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
            render: rowData => {
                const date = new Date(rowData.date);
                return isNaN(date.getTime()) ? rowData.date : date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            },
            customFilterAndSearch: (filter, rowData) => {
                if (!filter) return true;
                const rowDate = new Date(rowData.date);
                if (isNaN(rowDate.getTime())) return false; // Safe check

                const filterDate = new Date(filter);
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
            lookup: expenses.reduce((acc, curr) => {
                const cat = curr.category || 'Other';
                acc[cat] = cat;
                return acc;
            }, {}),
            filterPlaceholder: 'All Categories'
        },
        {
            title: 'Description',
            field: 'description',
            cellStyle: { whiteSpace: 'nowrap' },
            customFilterAndSearch: (filter, rowData) =>
                (rowData.description || '').toLowerCase().includes(filter.toLowerCase())
        },
        {
            title: 'Amount (₹)',
            field: 'amount',
            type: 'numeric',
            render: rowData => {
                const isCredit = rowData.type === 'CREDIT' || rowData.category === 'Income';
                const isDebit = rowData.type === 'DEBIT' || (rowData.amount < 0 && !isCredit);
                // If source is phonepe, trust type. Else assume expense unless specified.

                const color = isCredit ? 'green' : (isDebit ? 'red' : 'inherit');
                const sign = isCredit ? '+' : (isDebit ? '-' : '');

                return (
                    <Box component="span" sx={{ color, fontWeight: 'bold' }}>
                        {sign}₹{Math.abs(rowData.amount).toFixed(2)}
                    </Box>
                );
            },
            align: 'right',
            headerStyle: { textAlign: 'right' },
            customFilterAndSearch: (filter, rowData) => {
                if (!filter) return true;
                if (typeof filter !== 'string') return true;

                // Handle Range (100-500)
                if (filter.includes('-')) {
                    const [min, max] = filter.split('-').map(Number);
                    if (isNaN(min) || isNaN(max)) return true;
                    return Math.abs(rowData.amount) >= min && Math.abs(rowData.amount) <= max;
                }

                // Handle Exact Amount (100)
                return Math.abs(rowData.amount) === Number(filter);
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
            ),
            renderSummaryRow: (data) => {
                const total = data.reduce((sum, row) => sum + Math.abs(row.amount), 0);
                return (
                    <Box sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1rem', textAlign: 'right' }}>
                        Total: ₹{total.toLocaleString()}
                    </Box>
                );
            }
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
            onClick: (event, rowData) => {
                if (window.confirm("Are you sure you want to delete this expense?")) {
                    onDelete(rowData.id);
                }
            }
        }
    ];

    // Edit Handlers
    const handleEditClick = (expense) => {
        setSelectedExpense(expense);
        setEditModalOpen(true);
    };

    const handleEditSave = (updatedExpense) => {
        if (!window.confirm("Save changes to this expense?")) return;
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
                    pageSizeOptions: [5, 10, 20, 50, 100],
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
                        fontSize: '0.875rem'
                    },
                    cellStyle: {
                        fontSize: '0.875rem'
                    },
                    minBodyHeight: '200px',
                    responsive: true,
                    exportAllData: true,
                    showTitle: true,
                }}
                components={{
                    Toolbar: props => {
                        const displayData = props.dataManager?.searchedData || props.data || [];
                        const total = displayData.reduce((sum, item) => sum + Math.abs(item.amount), 0);

                        return (
                            <Box>
                                <MTableToolbar {...props} />
                                <Box sx={{ p: 1, px: 2, display: 'flex', justifyContent: 'flex-end', bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
                                    <Chip
                                        icon={<TrendingDownIcon />}
                                        label={`Total: ₹${total.toLocaleString()}`}
                                        color="primary"
                                        variant="filled"
                                        sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                                    />
                                </Box>
                            </Box>
                        );
                    }
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