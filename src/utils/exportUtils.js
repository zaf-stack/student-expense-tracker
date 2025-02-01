// src/utils/exportUtils.js
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (expenses) => {
    const worksheet = XLSX.utils.json_to_sheet(expenses.map(expense => ({
        Date: expense.date,
        Category: expense.category,
        Amount: expense.amount,
        Description: expense.description || ''
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = (expenses, summary) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Expense Report', 14, 15);
    
    // Add summary
    doc.setFontSize(12);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Total Expenses: ₹${summary.totalSpending.toFixed(2)}`, 14, 35);
    doc.text(`Monthly Average: ₹${summary.averageSpending.toFixed(2)}`, 14, 45);
    
    // Add expense table
    const tableData = expenses.map(expense => [
        expense.date,
        expense.category,
        `₹${expense.amount.toFixed(2)}`,
        expense.description || ''
    ]);

    doc.autoTable({
        startY: 55,
        head: [['Date', 'Category', 'Amount', 'Description']],
        body: tableData,
    });
    
    doc.save(`expense_report_${new Date().toISOString().split('T')[0]}.pdf`);
};
