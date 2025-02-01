// src/utils/validationUtils.js

export const validateExpenseForm = (formData) => {
    const errors = {};

    // Category validation
    if (!formData.category) {
        errors.category = 'Please select a category';
    }

    // Amount validation
    if (!formData.amount) {
        errors.amount = 'Please enter an amount';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        errors.amount = 'Please enter a valid amount greater than 0';
    } else if (parseFloat(formData.amount) > 1000000) {
        errors.amount = 'Amount cannot exceed ₹10,00,000';
    }

    // Date validation
    if (!formData.date) {
        errors.date = 'Please select a date';
    } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        if (selectedDate > today) {
            errors.date = 'Date cannot be in the future';
        }
    }

    // Description validation (optional field)
    if (formData.description && formData.description.length > 200) {
        errors.description = 'Description cannot exceed 200 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const formatErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'An unexpected error occurred';
};