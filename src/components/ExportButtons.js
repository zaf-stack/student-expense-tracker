import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

export default function ExportButtons({ expenses, summary }) {
    return (
        <ButtonGroup variant="contained" size="small">
            <Button
                onClick={() => exportToExcel(expenses)}
                startIcon={<FileDownloadIcon />}
            >
                Export to Excel
            </Button>
            <Button
                onClick={() => exportToPDF(expenses, summary)}
                startIcon={<FileDownloadIcon />}
            >
                Export to PDF
            </Button>
        </ButtonGroup>
    );
}
