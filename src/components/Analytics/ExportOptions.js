import React, { useState } from 'react';
import { Button, Menu, MenuItem, Stack, CircularProgress } from '@mui/material';
import { GetApp as GetAppIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportOptions = ({ data, title = 'Expense Report' }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const formatDataForExport = () => {
        return data.map(item => ({
            Date: item.date,
            Category: item.category,
            Description: item.description,
            Amount: `₹${item.amount}`,
            'Created At': new Date(item.createdAt).toLocaleString()
        }));
    };

    const exportToExcel = async () => {
        try {
            setIsExporting(true);
            const formattedData = formatDataForExport();

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

            // Auto-size columns
            const maxWidth = formattedData.reduce((w, r) => Math.max(w, r.Description.length), 10);
            const colWidth = Math.min(maxWidth, 50);
            worksheet['!cols'] = [
                { wch: 12 }, // Date
                { wch: 15 }, // Category
                { wch: colWidth }, // Description
                { wch: 12 }, // Amount
                { wch: 20 }  // Created At
            ];

            XLSX.writeFile(workbook, `${title}-${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        } finally {
            setIsExporting(false);
            handleClose();
        }
    };

    const exportToPDF = async () => {
        try {
            setIsExporting(true);
            const formattedData = formatDataForExport();

            const doc = new jsPDF();

            // Add title
            doc.setFontSize(16);
            doc.text(title, 14, 15);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

            // Add table
            doc.autoTable({
                startY: 35,
                head: [['Date', 'Category', 'Description', 'Amount',]],
                body: formattedData.map(item => [
                    item.Date,
                    item.Category,
                    item.Description,
                    item.Amount,
                    // item['Created At']
                ]),
                styles: { overflow: 'linebreak' },
                columnStyles: {
                    2: { cellWidth: 'auto' },
                    3: { halign: 'right' }
                }
            });

            doc.save(`${title}-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        } finally {
            setIsExporting(false);
            handleClose();
        }
    };

    return (
        <div>
            <Button
                variant="outlined"
                startIcon={isExporting ? <CircularProgress size={20} /> : <GetAppIcon />}
                onClick={handleClick}
                disabled={isExporting}
            >
                Export
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={exportToExcel} disabled={isExporting}>
                    Export to Excel
                </MenuItem>
                <MenuItem onClick={exportToPDF} disabled={isExporting}>
                    Export to PDF
                </MenuItem>
            </Menu>
        </div>
    );
};

export default ExportOptions;