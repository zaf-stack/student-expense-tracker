import React, { useState } from "react";
import { Button, Box, Typography, Grid } from "@mui/material";

const Calculator = ({ onClose, onCalculate }) => {
    const [input, setInput] = useState("");

    const handleClick = (value) => {
        if (value === "=") {
            try {
                setInput(eval(input).toString()); // Evaluate expression
            } catch {
                setInput("Error");
            }
        } else if (value === "AC") {
            setInput(""); // Clear input
        } else {
            setInput((prev) => prev + value);
        }
    };

    const handleConfirm = () => {
        onCalculate(parseFloat(input) || 0); // Return final value
        onClose();
    };

    return (
        <Box
            sx={{
                width: "300px",
                background: "#000",
                color: "#fff",
                p: 2,
                borderRadius: "10px",
                textAlign: "center"
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>
                {input || "0"}
            </Typography>
            <Grid container spacing={1}>
                {["AC", "+/-", "%", "÷", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", 0, ".", "="].map(
                    (item, index) => (
                        <Grid item xs={3} key={index}>
                            <Button
                                onClick={() => handleClick(item)}
                                sx={{
                                    width: "100%",
                                    height: "50px",
                                    background: ["+", "-", "*", "÷", "="].includes(item) ? "#ff9f0a" : "#333",
                                    color: "#fff",
                                    borderRadius: "60%",
                                    fontSize: "18px",
                                    "&:hover": { background: "#666" }
                                }}
                            >
                                {item}
                            </Button>
                        </Grid>
                    )
                )}
            </Grid>
            <Button onClick={handleConfirm} sx={{ mt: 2, background: "#28a745", color: "#fff" }}>
                Confirm
            </Button>
        </Box>
    );
};

export default Calculator;
