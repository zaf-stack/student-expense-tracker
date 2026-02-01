import React, { useMemo } from 'react';
import { Box, Card, CardContent, Grid, Typography, Stack, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function ImportDashboard({ transactions }) {
    const stats = useMemo(() => {
        if (!transactions || transactions.length === 0) return null;

        let totalCredit = 0;
        let totalDebit = 0;
        const categoryMap = {};

        transactions.forEach(tx => {
            const amount = Math.abs(tx.amount);
            if (tx.type === 'CREDIT' || tx.category === 'Income') {
                totalCredit += amount;
            } else {
                totalDebit += amount;
            }

            if (tx.type === 'DEBIT' && tx.category !== 'Income') {
                const cat = tx.category || 'Other';
                categoryMap[cat] = (categoryMap[cat] || 0) + amount;
            }
        });

        const topDebits = transactions
            .filter(t => t.type === 'DEBIT' && t.category !== 'Income')
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
            .slice(0, 4);

        const topCredits = transactions
            .filter(t => t.type === 'CREDIT' || t.category === 'Income')
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
            .slice(0, 4);

        const topCategories = Object.entries(categoryMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        return {
            totalCredit,
            totalDebit,
            net: totalCredit - totalDebit,
            topCategories,
            topDebits,
            topCredits
        };
    }, [transactions]);

    if (!stats) return null;

    return (
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Smart Insights
            </Typography>
            <Grid container rowSpacing={{ xs: 2, sm: 3 }} columnSpacing={{ xs: 0, sm: 3 }} sx={{ width: '100%', mx: 0 }}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2} sx={{ height: '100%' }}>
                        <Card sx={{ borderRadius: 3, bgcolor: '#f8f9fa' }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Typography color="text.secondary" gutterBottom>Net Flow</Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: stats.net >= 0 ? 'green' : 'red',
                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                        wordBreak: 'break-word',
                                        lineHeight: 1.2
                                    }}
                                >
                                    {stats.net >= 0 ? '+' : '-'}Rs. {Math.abs(stats.net).toLocaleString()}
                                </Typography>
                                <Stack spacing={1} sx={{ mt: 2 }}>
                                    <Chip
                                        icon={<TrendingUpIcon />}
                                        label={`Inc: Rs. ${stats.totalCredit.toLocaleString()}`}
                                        color="success"
                                        variant="outlined"
                                        size="small"
                                        sx={{ maxWidth: '100%', justifyContent: 'flex-start' }}
                                    />
                                    <Chip
                                        icon={<TrendingDownIcon />}
                                        label={`Exp: Rs. ${stats.totalDebit.toLocaleString()}`}
                                        color="error"
                                        variant="outlined"
                                        size="small"
                                        sx={{ maxWidth: '100%', justifyContent: 'flex-start' }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 3, flexGrow: 1 }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Typography color="text.secondary" gutterBottom>Top Spending Categories</Typography>
                                <Stack spacing={1.5} sx={{ mt: 1 }}>
                                    {stats.topCategories.map(([cat, amount], idx) => (
                                        <Box key={cat} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ pr: 1, wordBreak: 'break-word', flex: 1 }}>
                                                {idx + 1}. {cat}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                                Rs. {amount.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '100%', borderRadius: 3 }}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Grid container rowSpacing={{ xs: 2, sm: 2 }} columnSpacing={{ xs: 0, sm: 2 }} sx={{ width: '100%', mx: 0 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <ArrowDownwardIcon color="error" fontSize="small" /> Top Expenses
                                    </Typography>
                                    {stats.topDebits.map((tx, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1.5,
                                                p: 1,
                                                bgcolor: '#fff5f5',
                                                borderRadius: 2
                                            }}
                                        >
                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {tx.merchant || tx.description}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">{tx.date}</Typography>
                                            </Box>
                                            <Typography variant="body2" color="error" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                                {Math.abs(tx.amount).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <ArrowUpwardIcon color="success" fontSize="small" /> Top Income
                                    </Typography>
                                    {stats.topCredits.map((tx, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1.5,
                                                p: 1,
                                                bgcolor: '#f6ffed',
                                                borderRadius: 2
                                            }}
                                        >
                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {tx.merchant || tx.description}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">{tx.date}</Typography>
                                            </Box>
                                            <Typography variant="body2" color="success" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                                {Math.abs(tx.amount).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
