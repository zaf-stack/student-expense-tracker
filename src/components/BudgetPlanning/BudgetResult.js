import React, { useEffect } from "react";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import puppeteer from "puppeteer";
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

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        doc.setFont("Helvetica", "normal"); // Ensure consistent font across the document
        doc.setFontSize(16);

        doc.text("Personalized Budget Plan", 20, 10);
        doc.setFontSize(12);
        doc.text(`Name: ${userData.name}`, 10, 20);
        doc.text(`Location: ${userData.city}, ${userData.state}, ${userData.country}`, 10, 30);
        doc.text(`Income: ₹${userData.income}`, 10, 40);
        doc.text(`Saving Goal: ₹${userData.savingGoal}`, 10, 50);
        doc.text(`Goal: ${userData.goal}`, 10, 60);

        doc.setFontSize(14);
        doc.text("Budget Plan Details:", 10, 75);

        autoTable(doc, {
            startY: 80,
            theme: "grid",
            head: [["Category", "Details"]],
            body: [
                ["Name", userData.name],
                ["Location", `${userData.city}, ${userData.state}, ${userData.country}`],
                ["Monthly Income", `₹${userData.income}`],
                ["Saving Goal", `₹${userData.savingGoal}`],
                ["Financial Goal", userData.goal]
            ],
            styles: { fontSize: 11, cellPadding: 6, overflow: "linebreak", halign: "left" },
            columnStyles: { 0: { fontStyle: "bold" }, 1: { fontStyle: "normal" } },
            margin: { top: 85 },
            tableWidth: "auto"
        });

        doc.text("Budget Advice:", 10, doc.lastAutoTable.finalY + 10);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            theme: "grid",
            head: [["Advice"]],
            body: [
                [result.advice.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "-")]
            ],
            styles: { fontSize: 11, cellPadding: 6, overflow: "linebreak", halign: "left" },
            columnStyles: { 0: { fontStyle: "normal" } },
            margin: { top: 85 },
            tableWidth: "auto"
        });

        doc.save("budget-plan.pdf");
    };

    // const exportToPDF = async () => {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     const htmlContent = `
    //         <html>
    //         <head>
    //             <style>
    //                 body { font-family: 'Arial', sans-serif; padding: 20px; }
    //                 h1 { text-align: center; font-size: 22px; }
    //                 table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    //                 th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    //                 th { background-color: #f4f4f4; }
    //                 p { font-size: 14px; line-height: 1.6; }
    //             </style>
    //         </head>
    //         <body>
    //             <h1>Personalized Budget Plan</h1>
    //             <p><strong>Name:</strong> ${userData.name}</p>
    //             <p><strong>Location:</strong> ${userData.city}, ${userData.state}, ${userData.country}</p>
    //             <p><strong>Income:</strong> ₹${userData.income}</p>
    //             <p><strong>Saving Goal:</strong> ₹${userData.savingGoal}</p>
    //             <p><strong>Goal:</strong> ${userData.goal}</p>
    //             <h2>Budget Plan Details</h2>
    //             <table>
    //                 <tr><th>Category</th><th>Details</th></tr>
    //                 <tr><td>Name</td><td>${userData.name}</td></tr>
    //                 <tr><td>Location</td><td>${userData.city}, ${userData.state}, ${userData.country}</td></tr>
    //                 <tr><td>Monthly Income</td><td>₹${userData.income}</td></tr>
    //                 <tr><td>Saving Goal</td><td>₹${userData.savingGoal}</td></tr>
    //                 <tr><td>Financial Goal</td><td>${userData.goal}</td></tr>
    //             </table>
    //             <h2>Budget Advice</h2>
    //             <p>${result.advice.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "-")}</p>
    //         </body>
    //         </html>
    //     `;

    //     await page.setContent(htmlContent);
    //     await page.pdf({ path: "budget-plan.pdf", format: "A4" });
    //     await browser.close();
    // };

    return (
        <Box className="mt-4 flex justify-center">
            <Card className="bg-gray-100 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3">
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
                            <div className="whitespace-pre-line text-gray-700 text-lg leading-relaxed">{result.advice.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "-")}</div>
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
