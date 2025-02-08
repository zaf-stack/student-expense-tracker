import React, { useEffect } from "react";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import jsPDF from "jspdf";


const BudgetResult = ({ result, userData }) => {
    useEffect(() => {
        console.log("🔍 Checking userData:", userData);
        console.log("📊 Checking result:", result);
    }, [userData, result]);

    if (!userData || !result) {
        return (
            <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 3 }}>
                ❌ Error: Budget data is missing. Please try again.
            </Typography>
        );
    }

    // const BudgetResult = ({ result }) => {
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`Budget Plan`, 10, 10);
        doc.text(`Income: ₹${result.income}`, 10, 20);
        doc.text(`Saving Goal: ₹${result.savingGoal}`, 10, 30);
        doc.text(result.advice, 10, 40);
        doc.save("budget-plan.pdf");
    };

    return (
        // <Box sx={{ mt: 4 }}>
        //     <Typography variant="h6" gutterBottom>Your Personalized Budget Plan</Typography>
        //     <Typography paragraph>{result.advice}</Typography>
        //     <Button variant="outlined" onClick={exportToPDF}>Export as PDF</Button>
        // </Box>
        <Box sx={{ mt: 4 }}>
            <Card sx={{ background: "#f9f9f9", p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                        📊 {userData.name}'s Personalized Budget Plan
                    </Typography>

                    <Box sx={{ p: 2, background: "#fff", borderRadius: "8px", boxShadow: 2 }}>
                        <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-line", fontSize: "16px", color: "#444" }}>
                            <b>📝 Name:</b> {userData.name}
                            <br />
                            <b>🌍 Location:</b> {userData.city}, {userData.state}, {userData.country}
                            <br />
                            <b>💰 Income:</b> ₹{userData.income}
                            <br />
                            <b>💾 Saving Goal:</b> ₹{userData.savingGoal}
                            <br />
                            <b>🎯 Goal:</b> {userData.financialGoal}
                            <br /><br />

                            <Typography paragraph>{result.advice}</Typography>
                        </Typography>
                    </Box>

                    <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={exportToPDF}>
                        📄 Export as PDF
                    </Button>
                </CardContent>
            </Card>
        </Box>

    );
};

export default BudgetResult;
