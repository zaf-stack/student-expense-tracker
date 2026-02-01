import React, { useMemo, useState, useRef, useEffect } from 'react';
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
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { extractStatementRange, extractTextFromPdf, parsePhonePeText } from '../utils/phonepeParser';
import ExpenseList from '../components/DailyUsage/ExpenseList';
import CategorySummary from '../components/DailyUsage/CategorySummary';
import { categorizeTransactionsBatch } from '../services/geminiService';
import ImportDashboard from '../components/PhonePe/ImportDashboard';

const LEGACY_KEY = 'phonepeExpenses';
const SESSIONS_KEY = 'phonepeImportSessions';

const hashArrayBuffer = async (buffer) => {
    if (!window?.crypto?.subtle) return null;
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

const formatSessionLabel = (session) => {
    if (session?.statementRange?.start && session?.statementRange?.end) {
        return `${session.statementRange.start} - ${session.statementRange.end}`;
    }
    return session?.fileName || 'Imported Statement';
};

export default function PhonePeImport() {
    const [parsing, setParsing] = useState(false);
    const [analyzing, setAnalyzing] = useState(false); // AI State
    const [error, setError] = useState('');
    const [aiError, setAiError] = useState('');
    const [fileName, setFileName] = useState('');
    const [statementRange, setStatementRange] = useState(null);
    const [previewRows, setPreviewRows] = useState([]);
    const [pendingImportMeta, setPendingImportMeta] = useState(null);
    const [importSessions, setImportSessions] = useState(() => {
        const saved = localStorage.getItem(SESSIONS_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }

        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
            try {
                const legacyRows = JSON.parse(legacy);
                if (Array.isArray(legacyRows) && legacyRows.length > 0) {
                    const session = {
                        id: `import-${Date.now()}-legacy`,
                        fileName: 'Legacy Import',
                        fileHash: null,
                        rangeKey: null,
                        statementRange: null,
                        createdAt: new Date().toISOString(),
                        transactions: legacyRows
                    };
                    localStorage.setItem(SESSIONS_KEY, JSON.stringify([session]));
                    return [session];
                }
            } catch (e) {
                // ignore legacy parse errors
            }
        }

        return [];
    });
    const [activeSessionId, setActiveSessionId] = useState('');
    const [importStats, setImportStats] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const fileInputRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (importSessions.length > 0 && !activeSessionId) {
            setActiveSessionId(importSessions[0].id);
        }
    }, [importSessions, activeSessionId]);

    useEffect(() => {
        setTabValue(0);
    }, [activeSessionId]);

    const activeSession = useMemo(
        () => importSessions.find((session) => session.id === activeSessionId),
        [importSessions, activeSessionId]
    );
    const activeTransactions = activeSession?.transactions || [];
    const displayRange = activeSession?.statementRange || statementRange;

    const persistSessions = (nextSessions) => {
        setImportSessions(nextSessions);
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(nextSessions));
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setParsing(true);
        setAnalyzing(false);
        setError('');
        setImportStats(null);
        setAiError('');
        setFileName(file.name);
        setPendingImportMeta(null);

        try {
            const buffer = await file.arrayBuffer();
            const fileHash = await hashArrayBuffer(buffer);

            if (fileHash && importSessions.some((session) => session.fileHash === fileHash)) {
                setError('This statement file is already imported.');
                setParsing(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const text = await extractTextFromPdf(buffer);
            const range = extractStatementRange(text);
            const rangeKey = range ? `${range.start} - ${range.end}` : null;

            if (rangeKey && importSessions.some((session) => session.rangeKey === rangeKey)) {
                setError('A statement with the same date range is already imported.');
                setParsing(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            setStatementRange(range);
            const transactions = parsePhonePeText(text);

            if (transactions.length === 0) {
                setError('No transactions found. Please ensure it is a valid PhonePe PDF statement.');
                setParsing(false);
                return;
            }

            // Assign temp IDs for AI matching
            transactions.forEach((t, i) => t.tempId = `temp-${i}`);
            setPreviewRows(transactions);
            setPendingImportMeta({
                fileName: file.name,
                fileHash,
                statementRange: range,
                rangeKey,
                createdAt: new Date().toISOString()
            });
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
        setAiError('');
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
            console.error("AI Analysis failure", err);
            setAiError(err.message || 'AI analysis failed. Using rule-based categories instead.');
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
        setAiError('');
        setPendingImportMeta(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImport = () => {
        if (!previewRows.length) return;
        const sessionId = `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const statementRangeValue = pendingImportMeta?.statementRange || statementRange;
        const rangeKeyValue = pendingImportMeta?.rangeKey || (statementRangeValue ? `${statementRangeValue.start} - ${statementRangeValue.end}` : null);

        const normalizedRows = previewRows.map((row) => ({
            ...row,
            id: row.id || `${Date.now()}-${Math.random()}`,
            createdAt: row.createdAt || new Date().toISOString(),
            source: 'phonepe',
            category: row.type === 'CREDIT' ? 'Income' : (row.category || 'Other'),
            description: row.merchant ? `${row.merchant} (${row.description})` : row.description
        }));

        const newSession = {
            id: sessionId,
            fileName: pendingImportMeta?.fileName || fileName || 'PhonePe Statement',
            fileHash: pendingImportMeta?.fileHash || null,
            rangeKey: rangeKeyValue,
            statementRange: statementRangeValue,
            createdAt: pendingImportMeta?.createdAt || new Date().toISOString(),
            transactions: normalizedRows
        };

        const nextSessions = [newSession, ...importSessions];
        persistSessions(nextSessions);
        setActiveSessionId(sessionId);
        setImportStats({ added: normalizedRows.length, duplicates: 0 });
        setPreviewRows([]);
        setFileName('');
        setPendingImportMeta(null);
    };

    const handleDeleteImported = (id) => {
        const updatedSessions = importSessions.map((session) => {
            if (session.id !== activeSessionId) return session;
            return {
                ...session,
                transactions: session.transactions.filter((row) => row.id !== id)
            };
        });
        persistSessions(updatedSessions);
    };

    const handleDeleteAll = () => {
        if (window.confirm('Are you sure you want to delete ALL imported transactions? This cannot be undone.')) {
            setImportSessions([]);
            setActiveSessionId('');
            localStorage.removeItem(SESSIONS_KEY);
            localStorage.removeItem(LEGACY_KEY);
        }
    };

    const handleEditImported = (updatedRow) => {
        const updatedSessions = importSessions.map((session) => {
            if (session.id !== activeSessionId) return session;
            return {
                ...session,
                transactions: session.transactions.map((row) => row.id === updatedRow.id ? updatedRow : row)
            };
        });
        persistSessions(updatedSessions);
    };

    const handleDeleteSession = () => {
        if (!activeSessionId) return;
        if (!window.confirm('Delete this statement import? This cannot be undone.')) return;
        const nextSessions = importSessions.filter((session) => session.id !== activeSessionId);
        persistSessions(nextSessions);
        setActiveSessionId(nextSessions[0]?.id || '');
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
                <Stack spacing={1}>
                    <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        PhonePe Smart Import
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                        AI-powered import: Upload your PDF, and we'll categorize and analyze your spending automatically.
                    </Typography>
                    {displayRange && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                            Statement Range: {displayRange.start} - {displayRange.end}
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
                {aiError && !error && (
                    <Typography sx={{ mt: 2 }} color="warning.main">
                        {aiError}
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
                                                {row.type === 'CREDIT' ? '+' : '-'} Rs. {row.amount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {/* Imported Statements Section */}
            {importSessions.length > 0 && (
                <Box>
                    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
                            <FormControl fullWidth>
                                <InputLabel id="statement-select-label">Statement</InputLabel>
                                <Select
                                    labelId="statement-select-label"
                                    label="Statement"
                                    value={activeSessionId || ''}
                                    onChange={(e) => setActiveSessionId(e.target.value)}
                                >
                                    {importSessions.map((session) => (
                                        <MenuItem key={session.id} value={session.id}>
                                            {formatSessionLabel(session)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                                <Button variant="outlined" color="error" onClick={handleDeleteSession} fullWidth={isMobile}>
                                    Delete This Statement
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleDeleteAll} fullWidth={isMobile}>
                                    Clear All Data
                                </Button>
                            </Stack>
                        </Stack>
                        {activeSession && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Imported on: {new Date(activeSession.createdAt).toLocaleString()} | File: {activeSession.fileName} | Transactions: {activeTransactions.length}
                            </Typography>
                        )}
                    </Paper>

                    {activeTransactions.length > 0 && (
                        <>
                            {isMobile && (
                                <Paper sx={{ mb: 2, borderRadius: 2 }}>
                                    <Tabs
                                        value={tabValue}
                                        onChange={(e, val) => setTabValue(val)}
                                        variant="fullWidth"
                                        indicatorColor="primary"
                                        textColor="primary"
                                    >
                                        <Tab label="Analysis" />
                                        <Tab label="Transactions" />
                                    </Tabs>
                                </Paper>
                            )}

                            {!isMobile && (
                                <>
                                    <ImportDashboard transactions={activeTransactions} />
                                    <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 0, sm: 3 }} sx={{ mb: 3, width: '100%', mx: 0 }}>
                                        <Grid item xs={12}>
                                            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                                    Analytics (Selected Statement)
                                                </Typography>
                                                <CategorySummary expenses={activeTransactions} />
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
                                            <Stack>
                                                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                                    Transactions ({activeTransactions.length})
                                                </Typography>
                                                {importStats && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Last Import: +{importStats.added} new
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </Stack>
                                        <ExpenseList expenses={activeTransactions} onDelete={handleDeleteImported} onEdit={handleEditImported} />
                                    </Paper>
                                </>
                            )}

                            {isMobile && tabValue === 0 && (
                                <Box>
                                    <ImportDashboard transactions={activeTransactions} />
                                    <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>Analytics</Typography>
                                        <CategorySummary expenses={activeTransactions} />
                                    </Paper>
                                </Box>
                            )}

                            {isMobile && tabValue === 1 && (
                                <Paper sx={{ p: 2, borderRadius: 3 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Transactions ({activeTransactions.length})
                                        </Typography>
                                    </Stack>
                                    <ExpenseList expenses={activeTransactions} onDelete={handleDeleteImported} onEdit={handleEditImported} />
                                </Paper>
                            )}
                        </>
                    )}
                </Box>
            )}
        </Container>
    );
}
