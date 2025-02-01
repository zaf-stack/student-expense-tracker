import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';

export const useAnalytics = (expenses) => {
    const analytics = useMemo(() => {
        // Group expenses by month
        const monthlyData = expenses.reduce((acc, expense) => {
            const month = format(parseISO(expense.date), 'MMM yyyy');
            if (!acc[month]) {
                acc[month] = {
                    totalAmount: 0,
                    expenses: [],
                    categories: {}
                };
            }
            acc[month].totalAmount += expense.amount;
            acc[month].expenses.push(expense);
            
            // Track category totals
            if (!acc[month].categories[expense.category]) {
                acc[month].categories[expense.category] = 0;
            }
            acc[month].categories[expense.category] += expense.amount;
            
            return acc;
        }, {});

        // Convert to array for charts
        const monthlyChartData = Object.entries(monthlyData).map(([month, data]) => ({
            month,
            total: data.totalAmount,
            ...data.categories
        }));

        // Calculate daily averages
        const dailyAverages = expenses.reduce((acc, expense) => {
            const month = format(parseISO(expense.date), 'MMM yyyy');
            if (!acc[month]) {
                const date = parseISO(expense.date);
                const daysInMonth = endOfMonth(date).getDate();
                acc[month] = {
                    total: 0,
                    days: daysInMonth,
                };
            }
            acc[month].total += expense.amount;
            return acc;
        }, {});

        Object.keys(dailyAverages).forEach(month => {
            dailyAverages[month].average = 
                dailyAverages[month].total / dailyAverages[month].days;
        });

        // Category trends
        const categoryTrends = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = {
                    total: 0,
                    count: 0,
                    average: 0,
                    highest: 0,
                    lowest: Infinity
                };
            }
            
            const cat = acc[expense.category];
            cat.total += expense.amount;
            cat.count += 1;
            cat.average = cat.total / cat.count;
            cat.highest = Math.max(cat.highest, expense.amount);
            cat.lowest = Math.min(cat.lowest, expense.amount);
            
            return acc;
        }, {});

        return {
            monthlyData,
            monthlyChartData,
            dailyAverages,
            categoryTrends
        };
    }, [expenses]);

    return analytics;
};
