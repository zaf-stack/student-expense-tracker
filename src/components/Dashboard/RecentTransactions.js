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
    LocalGroceryStore,
    Restaurant,
    ShoppingBag,
    School,
    LocalHospital
} from '@mui/icons-material';

const CATEGORY_ICONS = {
    grocery: <LocalGroceryStore />,
    vegetables: <LocalGroceryStore />,
    fruits: <LocalGroceryStore />,
    snacks: <Restaurant />,
    outside_food: <Restaurant />,
    entertainment: <ShoppingBag />,
    education: <School />,
    medical: <LocalHospital />
};

export default function RecentTransactions({ transactions }) {
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
                                    {CATEGORY_ICONS[transaction.category]}
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
}