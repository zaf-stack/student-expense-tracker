import React, { useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import BudgetForm from "./BudgetForm";
import BudgetResult from "./BudgetResult";
import { getBudgetAdvice } from "./ChatGPTService";

const BudgetPlanningPage = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null); // ✅ Store complete user data

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError("");
            setUserData(data); // ✅ Store user data before fetching AI response

            const advice = await getBudgetAdvice(data);
            setResult({
                advice,
                income: data.income,
                savingGoal: data.savingGoal,
                name: data.name,
                country: data.country,
                state: data.state,
                city: data.city,
                goalType: data.goalType,
                financialGoal: data.financialGoal
            });
        } catch (err) {
            setError("Failed to fetch budget advice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">Personalized Budget Planning</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <BudgetForm onSubmit={onSubmit} />
            {loading && <CircularProgress />}
            {result && userData && <BudgetResult result={result} userData={userData} />}
        </Box>
    );
};

export default BudgetPlanningPage;
