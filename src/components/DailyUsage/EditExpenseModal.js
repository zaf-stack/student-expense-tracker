import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    FormHelperText,
    Alert
} from '@mui/material';
import { validateExpenseForm } from '../../utils/validationUtils';

const categories = [
    { id: 'grocery', name: 'Grocery' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'outside_food', name: 'Outside Food' }
];

export default function EditExpenseModal({ open, expense, onClose, onSave }) {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: ''
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (expense) {
            setFormData({
                category: expense.category || '',
                amount: expense.amount || '',
                description: expense.description || '',
                date: expense.date || new Date().toISOString().split('T')[0]
            });
            // Clear errors when loading new expense
            setErrors({});
            setSubmitError('');
        }
    }, [expense]);

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

    const handleSubmit = async () => {
        setSubmitError('');

        // Validate form
        const validation = validateExpenseForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                ...expense,
                ...formData,
                amount: parseFloat(formData.amount)
            });
            onClose();
        } catch (error) {
            setSubmitError('Failed to update expense. Please try again.');
            console.error('Error updating expense:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        // <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        //     <DialogTitle>Edit Expense</DialogTitle>
        //     <DialogContent>
        //         <div className="space-y-4 mt-4">
        //             <FormControl fullWidth>
        //                 <InputLabel>Category</InputLabel>
        //                 <Select
        //                     name="category"
        //                     value={formData.category}
        //                     label="Category"
        //                     onChange={handleChange}
        //                     required
        //                 >
        //                     {categories.map(cat => (
        //                         <MenuItem key={cat.id} value={cat.id}>
        //                             {cat.name}
        //                         </MenuItem>
        //                     ))}
        //                 </Select>
        //             </FormControl>

        //             <TextField
        //                 fullWidth
        //                 label="Amount"
        //                 name="amount"
        //                 type="number"
        //                 value={formData.amount}
        //                 onChange={handleChange}
        //                 required
        //                 InputProps={{
        //                     startAdornment: <InputAdornment position="start">₹</InputAdornment>,
        //                 }}
        //             />

        //             <TextField
        //                 fullWidth
        //                 label="Description"
        //                 name="description"
        //                 value={formData.description}
        //                 onChange={handleChange}
        //                 multiline
        //                 rows={2}
        //             />

        //             <TextField
        //                 fullWidth
        //                 label="Date"
        //                 name="date"
        //                 type="date"
        //                 value={formData.date}
        //                 onChange={handleChange}
        //                 required
        //                 InputLabelProps={{
        //                     shrink: true,
        //                 }}
        //             />
        //         </div>
        //     </DialogContent>
        //     <DialogActions>
        //         <Button onClick={onClose}>Cancel</Button>
        //         <Button onClick={handleSubmit} variant="contained" color="primary">
        //             Save Changes
        //         </Button>
        //     </DialogActions>
        // </Dialog>

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { minHeight: '400px' }
            }}
        >
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent>
                {submitError && (
                    <Alert severity="error" className="mb-4 mt-2">
                        {submitError}
                    </Alert>
                )}

                <div className="space-y-4 mt-4">
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
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}