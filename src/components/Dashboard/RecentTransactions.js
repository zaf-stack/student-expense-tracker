import React from 'react';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider
} from '@mui/material';
import {

    ShoppingBag,
    LocalGroceryStore,
    School
} from '@mui/icons-material';

const transactions = [
    {
        id: 1,
        title: 'Lunch',
        amount: -120,
        category: 'Food',
        date: '18 Jan 2024',
        icon: <School />
    },
    {
        id: 2,
        title: 'Books',
        amount: -850,
        category: 'Education',
        date: '17 Jan 2024',
        icon: <School />
    },
    {
        id: 3,
        title: 'Groceries',
        amount: -560,
        category: 'Daily Needs',
        date: '17 Jan 2024',
        icon: <LocalGroceryStore />
    },
    {
        id: 4,
        title: 'Shopping',
        amount: -1200,
        category: 'Personal',
        date: '16 Jan 2024',
        icon: <ShoppingBag />
    },
];

export default function RecentTransactions() {
    return (
        <>
            <Typography variant="h6" className="mb-4">
                Recent Transactions
            </Typography>
            <List>
                {transactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar className="bg-blue-100 text-blue-600">
                                    {transaction.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={transaction.title}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="textSecondary">
                                            {transaction.category} • {transaction.date}
                                        </Typography>
                                        <Typography component="span" variant="body2" className="ml-2" color={transaction.amount < 0 ? "error" : "primary"}>
                                            ₹{Math.abs(transaction.amount)}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        {index < transactions.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </>
    );
};