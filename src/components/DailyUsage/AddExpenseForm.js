// src/components/DailyUsage/AddExpenseForm.js
import React, { useState } from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    InputAdornment,
    FormHelperText,
    Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { validateExpenseForm } from '../../utils/validationUtils';

const categories = [
    { id: 'grocery', name: 'Grocery' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'outside_food', name: 'Outside Food' }
];

export default function AddExpenseForm({ onSubmit }) {

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log('Form Data:', formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        // Validate form
        const validation = validateExpenseForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                amount: parseFloat(formData.amount)
            });

            // Reset form
            setFormData({
                category: '',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setErrors({});
        } catch (error) {
            setSubmitError('Failed to add expense. Please try again.');
            console.error('Error adding expense:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for the field being changed
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    // TODO: Add expense handling logic

    //     setFormData({
    //         category: '',
    //         amount: '',
    //         description: '',
    //         date: new Date().toISOString().split('T')[0]
    //     });
    // };

    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value
    //     });
    // };

    return (
        // <form onSubmit={handleSubmit}>
        //     <Typography variant="h6" className="mb-4">
        //         Add Daily Expense
        //     </Typography>

        //     <div className="space-y-4">
        //         <FormControl fullWidth>
        //             <InputLabel>Category</InputLabel>
        //             <Select
        //                 name="category"
        //                 value={formData.category}
        //                 label="Category"
        //                 onChange={handleChange}
        //                 required
        //             >
        //                 {categories.map(cat => (
        //                     <MenuItem key={cat.id} value={cat.id}>
        //                         {cat.name}
        //                     </MenuItem>
        //                 ))}
        //             </Select>
        //         </FormControl>

        //         <TextField
        //             fullWidth
        //             label="Amount"
        //             name="amount"
        //             type="number"
        //             value={formData.amount}
        //             onChange={handleChange}
        //             required
        //             InputProps={{
        //                 startAdornment: <InputAdornment position="start">₹</InputAdornment>,
        //             }}
        //         />

        //         <TextField
        //             fullWidth
        //             label="Description"
        //             name="description"
        //             value={formData.description}
        //             onChange={handleChange}
        //             multiline
        //             rows={2}
        //         />

        //         <TextField
        //             fullWidth
        //             label="Date"
        //             name="date"
        //             type="date"
        //             value={formData.date}
        //             onChange={handleChange}
        //             required
        //             InputLabelProps={{
        //                 shrink: true,
        //             }}
        //         />

        //         <Button
        //             type="submit"
        //             variant="contained"
        //             color="primary"
        //             fullWidth
        //             startIcon={<AddIcon />}
        //         >
        //             Add Expense
        //         </Button>
        //     </div>
        // </form>

        <form onSubmit={handleSubmit}>
            <Typography variant="h6" className="mb-4">
                Add Daily Expense
            </Typography>

            {submitError && (
                <Alert severity="error" className="mb-4">
                    {submitError}
                </Alert>
            )}

            <div className="space-y-4">
                <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        value={formData.category}
                        label="Category"
                        onChange={handleChange}
                        required
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.category && (
                        <FormHelperText>{errors.category}</FormHelperText>
                    )}
                </FormControl>

                <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    error={!!errors.amount}
                    helperText={errors.amount}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                />

                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description}
                />

                <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    error={!!errors.date}
                    helperText={errors.date}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<AddIcon />}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Expense'}
                </Button>
            </div>
        </form>
    );
}