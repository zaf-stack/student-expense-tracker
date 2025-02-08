import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Grid, MenuItem } from '@mui/material';

const BudgetForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Full Name" {...register("name", { required: "Name is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Country" {...register("country", { required: "Country is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="State" {...register("state", { required: "State is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="City" {...register("city", { required: "City is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Monthly Income (₹)" type="number" {...register("income", { required: "Income is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Monthly Saving Goal (₹)" type="number" {...register("savingGoal", { required: "Saving goal is required" })} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Goal Type" select defaultValue="monthly" {...register("goalType")}>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Financial Goal (e.g., Buy a house, Retirement Planning)" {...register("goal", { required: "Goal is required" })} />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">Generate Budget Plan</Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default BudgetForm;
