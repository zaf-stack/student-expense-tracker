import React, { useEffect } from "react";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import jsPDF from "jspdf";
import "tailwindcss/tailwind.css";

const BudgetResult = ({ result, userData }) => {
    useEffect(() => {
        console.log("🔍 Checking userData:", userData);
        console.log("📊 Checking result:", result);
    }, [userData, result]);

    if (!userData || !result) {
        return (
            <Typography variant="h6" color="error" className="text-center mt-3">
                ❌ Error: Budget data is missing. Please try again.
            </Typography>
        );
    }

    const formatText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong class='text-lg'>$1</strong>") // Convert **bold text** to <strong> with larger size
            .replace(/\* (.*?)$/gm, "👉 <span class='text-sm'>$1</span>"); // Convert single list items (*) to indicate finger emoji with smaller text
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Budget Plan", 10, 10);
        doc.text(`Income: ₹${result.income}`, 10, 20);
        doc.text(`Saving Goal: ₹${result.savingGoal}`, 10, 30);
        doc.text(result.advice, 10, 40);
        doc.save("budget-plan.pdf");
    };

    return (
        <Box className="mt-4 flex justify-center">
            <Card className="bg-gray-100 rounded-lg shadow-lg w-full">
                <CardContent>
                    <Typography variant="h5" className="font-bold text-gray-800 mb-4 text-center">
                        📊 {userData.name}'s Personalized Budget Plan
                    </Typography>

                    <Box className="p-5 bg-white rounded-md shadow-md w-full">
                        <Typography className="text-lg text-gray-700">
                            <span className="font-semibold">📝 Name:</span> {userData.name}
                            <br />
                            <span className="font-semibold">🌍 Location:</span> {userData.city}, {userData.state}, {userData.country}
                            <br />
                            <span className="font-semibold">💰 Income:</span> ₹{userData.income}
                            <br />
                            <span className="font-semibold">💾 Saving Goal:</span> ₹{userData.savingGoal}
                            <br />
                            <span className="font-semibold">🎯 Goal:</span> {userData.goal}
                            <br /><br />
                            <div className="whitespace-pre-line text-gray-700 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(result.advice) }} />
                        </Typography>
                    </Box>

                    <div className="flex justify-center mt-5">
                        <Button variant="contained" color="secondary" className="w-full md:w-auto" onClick={exportToPDF}>
                            📄 Export as PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BudgetResult;
