import React, { useMemo, useState, useRef } from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid,
    CircularProgress,
    Chip,
    useMediaQuery,
    useTheme,
    Tabs,
    Tab
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { extractStatementRange, extractTextFromPdf, parsePhonePeText } from '../utils/phonepeParser';
import ExpenseList from '../components/DailyUsage/ExpenseList';
import CategorySummary from '../components/DailyUsage/CategorySummary';
import { categorizeTransactionsBatch } from '../services/geminiService';
import ImportDashboard from '../components/PhonePe/ImportDashboard';

const STORAGE_KEY = 'phonepeExpenses';

// Enhanced Hash to prevent duplicates (Date + Amount + Type + Specific Time if avail)
const buildHash = (tx) => `${tx.date}|${tx.amount}|${tx.type}|${tx.time || ''}|${tx.description}`;

export default function PhonePeImport() {
    const [parsing, setParsing] = useState(false);
    const [analyzing, setAnalyzing] = useState(false); // AI State
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [statementRange, setStatementRange] = useState(null);
    const [previewRows, setPreviewRows] = useState([]);
    const [importedRows, setImportedRows] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        // Ensure parsing works for saved data
        try {
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [importStats, setImportStats] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const fileInputRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const existingHashes = useMemo(() => new Set(importedRows.map(buildHash)), [importedRows]);

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setParsing(true);
        setAnalyzing(false);
        setError('');
        setImportStats(null);
        setFileName(file.name);

        try {
            // 1. Parse PDF
            const text = await extractTextFromPdf(file);
            setStatementRange(extractStatementRange(text));
            const transactions = parsePhonePeText(text);

            if (transactions.length === 0) {
                setError('No transactions found. Please ensure it is a valid PhonePe PDF statement.');
                setParsing(false);
                return;
            }

            // Assign temp IDs for AI matching
            transactions.forEach((t, i) => t.tempId = `temp-${i}`);
            setPreviewRows(transactions);
            setParsing(false);

            // 2. Trigger AI Analysis
            await runAiAnalysis(transactions);

        } catch (err) {
            console.error(err);
            setError('Failed to parse PDF. Please check if the file is a valid PhonePe statement.');
            setParsing(false);
        }
    };

    const runAiAnalysis = async (transactions) => {
        setAnalyzing(true);
        try {
            // Increased batch size to 50 since 1.5 Flash has adequate context window.
            // Fewer requests = Less chance of 429 Rate Limits.
            const batchSize = 50;
            const updatedTransactions = [...transactions];

            for (let i = 0; i < transactions.length; i += batchSize) {
                const batch = transactions.slice(i, i + batchSize);

                // Keep a small delay just to be safe between large batches
                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                const results = await categorizeTransactionsBatch(batch);

                // Merge AI results
                results.forEach(res => {
                    const index = updatedTransactions.findIndex(t => t.tempId === res.id);
                    if (index !== -1) {
                        updatedTransactions[index].category = res.category;
                        updatedTransactions[index].merchant = res.merchant;
                        // If we have a clean merchant, maybe prepend to description or keep separate?
                        // For now, let's keep description as is, but use merchant for display if needed.
                    }
                });

                // Update matches progressively
                setPreviewRows([...updatedTransactions]);
            }
        } catch (err) {
            console.error("AI Analysis partial failure", err);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleReset = () => {
        setParsing(false);
        setAnalyzing(false);
        setError('');
        setFileName('');
        setStatementRange(null);
        setPreviewRows([]);
        setImportStats(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImport = () => {
        if (!previewRows.length) return;
        const merged = [...importedRows];
        let duplicates = 0;
        let added = 0;

        previewRows.forEach((row) => {
            const hash = buildHash(row);
            if (existingHashes.has(hash)) {
                duplicates += 1;
                return;
            }
            merged.push({
                ...row,
                id: Date.now() + Math.random(),
                createdAt: new Date().toISOString(),
                source: 'phonepe',
                category: row.type === 'CREDIT' ? 'Income' : (row.category || 'Other'),
                description: row.merchant ? `${row.merchant} (${row.description})` : row.description
            });
            existingHashes.add(hash);
            added += 1;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        setImportedRows(merged);
        setImportStats({ added, duplicates });
        setPreviewRows([]); // Clear preview after import
        setFileName(''); // Reset file selection
    };

    const handleDeleteImported = (id) => {
        const updated = importedRows.filter(row => row.id !== id);
        setImportedRows(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleDeleteAll = () => {
        if (window.confirm('Are you sure you want to delete ALL imported transactions? This cannot be undone.')) {
            setImportedRows([]);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const handleEditImported = (updatedRow) => {
        const updated = importedRows.map(row => row.id === updatedRow.id ? updatedRow : row);
        setImportedRows(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
                <Stack spacing={1}>
                    <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        PhonePe Smart Import 🤖
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                        AI-powered import: Upload your PDF, and we'll categorize and analyze your spending automatically.
                    </Typography>
                    {statementRange && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                            Statement Range: {statementRange.start} - {statementRange.end}
                        </Typography>
                    )}
                </Stack>
            </Paper>

            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
                <Stack spacing={2}>
                    <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            Upload & Analyze
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                            Supported: PhonePe transaction statement PDF only.
                        </Typography>
                        {fileName && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.8125rem' } }}>
                                Selected: {fileName}
                            </Typography>
                        )}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            disabled={parsing || analyzing}
                            fullWidth={isMobile}
                            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                        >
                            Upload PDF
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                hidden
                                onChange={handleFileUpload}
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<RestartAltIcon />}
                            onClick={handleReset}
                            fullWidth={isMobile}
                            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                        >
                            Reset
                        </Button>
                    </Stack>
                </Stack>

                {(parsing || analyzing) && (
                    <Box sx={{ mt: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                            {parsing ? <LinearProgress sx={{ flex: 1 }} /> : <CircularProgress size={20} />}
                            <Typography variant="caption" color="text.secondary">
                                {parsing ? 'Extracting text...' : 'AI is categorizing your transactions...'}
                            </Typography>
                        </Stack>
                    </Box>
                )}

                {error && (
                    <Typography sx={{ mt: 2 }} color="error">
                        {error}
                    </Typography>
                )}
            </Paper>

            {previewRows.length > 0 && (
                <Box>
                    {/* Dashboard Preview */}
                    <ImportDashboard transactions={previewRows} />

                    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                Preview ({previewRows.length})
                                {analyzing && <Chip icon={<AutoAwesomeIcon />} label="AI Analyzing..." size="small" color="primary" sx={{ ml: 1 }} />}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={handleImport} disabled={analyzing} fullWidth={isMobile}>
                                Import & Save
                            </Button>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <TableContainer sx={{ maxHeight: 400, overflowX: 'auto' }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Details</TableCell>
                                        <TableCell>AI Category</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {previewRows.map((row, idx) => (
                                        <TableRow key={`preview-${idx}`}>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{row.description}</Typography>
                                                {row.merchant && (
                                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                                                        {row.merchant}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.category || 'Other'}
                                                    size="small"
                                                    color={row.category && row.category !== 'Other' ? 'success' : 'default'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: row.type === 'CREDIT' ? 'success.main' : 'error.main' }}>
                                                {row.type === 'CREDIT' ? '+' : '-'} ₹{row.amount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {/* Imported Transactions Section with Charts and Table */}
            {importedRows.length > 0 && (
                <Box>
                    {/* Persistent Dashboard for Imported Data */}
                    <ImportDashboard transactions={importedRows} />

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                    Analytics (All Time)
                                </Typography>
                                <CategorySummary expenses={importedRows} />
                            </Paper>
                        </Grid>
                    </Grid>

                    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
                            <Stack>
                                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                    Imported PhonePe Transactions ({importedRows.length})
                                </Typography>
                                {importStats && (
                                    <Typography variant="body2" color="text.secondary">
                                        Last Import: +{importStats.added} new | {importStats.duplicates} duplicates
                                    </Typography>
                                )}
                            </Stack>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={handleDeleteAll}
                            >
                                Clear All Data
                            </Button>
                        </Stack>
                        <ExpenseList
                            expenses={importedRows}
                            onDelete={handleDeleteImported}
                            onEdit={handleEditImported}
                        />
                    </Paper>
                </Box>
            )}
        </Container>
    );
}
