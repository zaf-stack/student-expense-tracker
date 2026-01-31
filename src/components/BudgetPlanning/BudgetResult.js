import React, { useEffect, useRef } from "react";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "tailwindcss/tailwind.css";
import { useReactToPrint } from "react-to-print";

const BudgetResult = ({ result, userData }) => {
    // const componentRef = useRef();

    useEffect(() => {
        console.log("🔍 Checking userData:", userData);
        console.log("📊 Checking result:", result);
    }, [userData, result]);

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current, // ✅ सीधे ref pass करें
    //     documentTitle: `${userData?.name}_Budget_Plan`, // PDF का नाम
    //     onBeforePrint: () => console.log("Printing started..."), // Optional
    //     removeAfterPrint: true // Temporary elements clean करे
    // });

    if (!userData || !result) {
        return (
            <Typography variant="h6" color="error" className="text-center mt-3">
                ❌ Error: Budget data is missing. Please try again.
            </Typography>
        );
    }

    const formatText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong class='text-lg'>$1</strong>") // Convert **bold text** to <strong>
            .replace(/\* (.*?)$/gm, "👉 <span class='text-sm'>$1</span>"); // Convert list items (*) to indicate finger emoji with smaller text
    };


    const exportToPDF = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            putOnlyUsedFonts: true
        });

        // Custom styling
        const titleFontSize = 18;
        const headerFontSize = 14;
        const bodyFontSize = 12;
        const margin = 15;
        let yPos = margin;

        // Main title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(titleFontSize);
        doc.text("Personalized Budget Plan", margin, yPos);
        yPos += 10;

        // User details
        doc.setFontSize(bodyFontSize);
        doc.setFont("helvetica", "normal");
        const userDetails = [
            `👤 Name: ${userData.name}`,
            `📍 Location: ${userData.city}, ${userData.state}`,
            `💰 Income: ₹${Number(userData.income).toLocaleString('en-IN')}/month`,
            `🎯 Saving Goal: ₹${Number(userData.savingGoal).toLocaleString('en-IN')} (${userData.goalType})`,
            `📌 Financial Goal: ${userData.goal}`
        ];

        userDetails.forEach((detail) => {
            doc.text(detail, margin, yPos);
            yPos += 7;
        });
        yPos += 10;

        // Process advice text (UI के format को retain करते हुए)
        const cleanAdvice = result.advice
            .replace(/\*\*/g, '') // Bold हटाएं
            .replace(/1️⃣|2️⃣|3️⃣/g, '') // नंबर emojis हटाएं
            .replace(/👉/g, '• '); // 👉 को bullets में बदलें

        // Sections को अलग करें और tables में डालें
        const sections = cleanAdvice.split(/\n\s*\n/);

        autoTable(doc, {
            startY: yPos,
            head: [['Budget Breakdown']],
            body: [[cleanAdvice]],
            theme: 'grid',
            styles: {
                fontSize: bodyFontSize,
                cellPadding: 6,
                overflow: 'linebreak',
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            },
            margin: { left: margin, right: margin },
            pageBreak: 'auto' // Multi-page support
        });

        // Final note
        doc.setFont("helvetica", "italic");
        doc.text("~ Generated using Student Expense Tracker ~", margin, doc.lastAutoTable.finalY + 10);

        doc.save(`Budget-Plan-${userData.name}.pdf`);
    };
    return (

        <Box className="mt-4 flex justify-center">
            {/* <div ref={componentRef} className="w-full"> */}
            <Card className="bg-gray-100 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3" >
                <CardContent>
                    <Typography variant="h5" className="font-bold text-gray-800 mb-4 text-center">
                        📊 {userData.name}'s Personalized Budget Plan
                    </Typography>

                    <Box className="p-5 bg-white rounded-md shadow-md w-full">
                        <Typography className="text-lg text-gray-700">
                            <span className="font-semibold">📝 Name:</span> {userData.name}
                            <br />
                            <span className="font-semibold">🌍 Location:</span> {[userData.city, userData.state, userData.country].filter(Boolean).join(", ") || "Global"}
                            <br />
                            <span className="font-semibold">💰 Income:</span> ₹{Number(userData.income).toLocaleString('en-IN')}
                            <br />
                            <span className="font-semibold">💾 Saving Goal:</span> ₹{Number(userData.savingGoal).toLocaleString('en-IN')}
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
            {/* </div> */}
            {/* Print Button */}
            {/* <div className="flex justify-center mt-5">
                <Button
                    variant="contained"
                    onClick={handlePrint}
                    disabled={!componentRef.current} // ✅ Ref के set होने तक disable
                >
                    🖨 Print or Save as PDF
                </Button>
            </div> */}
        </Box>
    );
};

export default BudgetResult;
