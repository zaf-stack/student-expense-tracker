import React, { useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import BudgetWizard from "./BudgetWizard";
import BudgetResult from "./BudgetResult";
import { getBudgetAdvice } from "./ChatGPTService";

const BudgetPlanningPage = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);

    const onSubmit = async (wizardData) => {
        try {
            setLoading(true);
            setError("");

            // Map Wizard data to the format expected by ChatGPTService and BudgetResult
            const formattedData = {
                ...wizardData, // Spread all fields (name, age, city, etc.)
                // Ensure specific fields are correctly formatted if needed, though they match now
                rentAmount: wizardData.rentAmount || 0,
                loanEMI: wizardData.loanEMI || 0,
                savingGoal: wizardData.savingGoal || 0,
            };

            setUserData(formattedData);

            const advice = await getBudgetAdvice(formattedData);
            setResult({
                advice,
                ...formattedData
            });
        } catch (err) {
            console.error(err);
            setError("Failed to fetch budget advice. Please ensure you have an active internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" textAlign="center" sx={{ mb: 4, fontWeight: 'bold', color: '#334155' }}>
                    🚀 Interactive Budget Planner
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {!result && !loading && (
                    <BudgetWizard onSubmit={onSubmit} />
                )}

                {loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                            Creating your personalized financial plan...
                        </Typography>
                    </Box>
                )}
            </Box>

            {result && userData && !loading && (
                <Box sx={{ mt: 4 }}>
                    <BudgetResult result={result} userData={userData} />
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography
                            variant="button"
                            color="primary"
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setResult(null)}
                        >
                            Start Over
                        </Typography>
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default BudgetPlanningPage;
