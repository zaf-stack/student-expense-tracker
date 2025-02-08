import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const BudgetForm = ({ onSubmit }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const watchLiving = watch("living"); // Watch living status
    const watchDebt = watch("hasDebt"); // Watch debt status

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                {/* Basic User Information */}
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Full Name" {...register("name", { required: "Name is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="User Language" {...register("language", { required: "Language is required" })} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Country" {...register("country", { required: "Country is required" })} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="State" {...register("state", { required: "State is required" })} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="City" {...register("city", { required: "City is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>User Type</InputLabel>
                        <Select defaultValue="student" {...register("userType")}>
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="worker">Worker</MenuItem>
                            <MenuItem value="business">Business</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField fullWidth label="Age" type="number" {...register("age", { required: "Age is required" })} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select defaultValue="other" {...register("gender")}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Marital Status</InputLabel>
                        <Select defaultValue="single" {...register("maritalStatus")}>
                            <MenuItem value="single">Single</MenuItem>
                            <MenuItem value="married">Married</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Living Situation</InputLabel>
                        <Select defaultValue="own" {...register("living")}>
                            <MenuItem value="own">Own House</MenuItem>
                            <MenuItem value="rent">Rent</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {watchLiving === "rent" && (
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Monthly Rent (₹)" type="number" {...register("rentAmount")} />
                    </Grid>
                )}

                {/* Financial Details */}
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Monthly Income (₹)" type="number" {...register("income", { required: "Income is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Monthly Saving Goal (₹)" type="number" {...register("savingGoal", { required: "Saving goal is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Goal Type</InputLabel>
                        <Select defaultValue="monthly" {...register("goalType")}>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Financial Goal (e.g., Buy a house, Travel, Save for Car)" {...register("goal", { required: "Goal is required" })} />
                </Grid>

                {/* Additional Financial Inputs */}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Do you have any Loans/Debt?</InputLabel>
                        <Select defaultValue="no" {...register("hasDebt")}>
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {watchDebt === "yes" && (
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Loan EMI (₹)" type="number" {...register("loanEMI")} />
                    </Grid>
                )}

                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Emergency Fund (₹)" type="number" {...register("emergencyFund")} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Spending Habits</InputLabel>
                        <Select defaultValue="moderate" {...register("spendingHabits")}>
                            <MenuItem value="conservative">Conservative</MenuItem>
                            <MenuItem value="moderate">Moderate</MenuItem>
                            <MenuItem value="impulsive">Impulsive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">Generate Budget Plan</Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default BudgetForm;
