import React, { useState } from "react";
import { Button, Box, Typography, Grid } from "@mui/material";

const OPERATORS = ["+", "-", "*", "/"];
const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2 };

const isOperator = (char) => OPERATORS.includes(char);

const applyOperator = (op, b, a) => {
    if (a === undefined || b === undefined) throw new Error("Invalid expression");
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (b === 0) throw new Error("Divide by zero");
            return a / b;
        default:
            throw new Error("Unknown operator");
    }
};

const evaluateExpression = (expression) => {
    if (!expression) return 0;

    const values = [];
    const ops = [];
    let i = 0;
    let prevType = "operator";

    while (i < expression.length) {
        const char = expression[i];

        if (char === " ") {
            i += 1;
            continue;
        }

        const isUnaryMinus = char === "-" && prevType === "operator";
        if (/[0-9.]/.test(char) || isUnaryMinus) {
            let numStr = char;
            i += 1;
            while (i < expression.length && /[0-9.]/.test(expression[i])) {
                numStr += expression[i];
                i += 1;
            }
            const value = parseFloat(numStr);
            if (Number.isNaN(value)) throw new Error("Invalid number");
            values.push(value);
            prevType = "number";
            continue;
        }

        if (isOperator(char)) {
            while (ops.length && PRECEDENCE[ops[ops.length - 1]] >= PRECEDENCE[char]) {
                const op = ops.pop();
                const b = values.pop();
                const a = values.pop();
                values.push(applyOperator(op, b, a));
            }
            ops.push(char);
            prevType = "operator";
            i += 1;
            continue;
        }

        throw new Error("Invalid character");
    }

    while (ops.length) {
        const op = ops.pop();
        const b = values.pop();
        const a = values.pop();
        values.push(applyOperator(op, b, a));
    }

    if (values.length !== 1) throw new Error("Invalid expression");
    return values[0];
};

const updateLastNumber = (input, updater) => {
    const match = input.match(/(-?\d*\.?\d+)(?!.*\d)/);
    if (!match) return input;
    const value = match[0];
    const startIndex = match.index ?? 0;
    const endIndex = startIndex + value.length;
    const updated = updater(value);
    return `${input.slice(0, startIndex)}${updated}${input.slice(endIndex)}`;
};

const Calculator = ({ onClose, onCalculate }) => {
    const [input, setInput] = useState("");

    const handleClick = (value) => {
        if (value === "=") {
            try {
                const result = evaluateExpression(input);
                setInput(result.toString());
            } catch {
                setInput("Error");
            }
            return;
        }

        if (value === "AC") {
            setInput("");
            return;
        }

        if (value === "+/-") {
            setInput((prev) => updateLastNumber(prev, (num) => (num.startsWith("-") ? num.slice(1) : `-${num}`)));
            return;
        }

        if (value === "%") {
            setInput((prev) => updateLastNumber(prev, (num) => (parseFloat(num) / 100).toString()));
            return;
        }

        setInput((prev) => prev + value);
    };

    const handleConfirm = () => {
        onCalculate(parseFloat(input) || 0);
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
                {["AC", "+/-", "%", "/", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", 0, ".", "="]
                    .map((item, index) => (
                        <Grid item xs={3} key={index}>
                            <Button
                                onClick={() => handleClick(item)}
                                sx={{
                                    width: "100%",
                                    height: "50px",
                                    background: ["+", "-", "*", "/", "="].includes(item) ? "#ff9f0a" : "#333",
                                    color: "#fff",
                                    borderRadius: "60%",
                                    fontSize: "18px",
                                    "&:hover": { background: "#666" }
                                }}
                            >
                                {item}
                            </Button>
                        </Grid>
                    ))}
            </Grid>
            <Button onClick={handleConfirm} sx={{ mt: 2, background: "#28a745", color: "#fff" }}>
                Confirm
            </Button>
        </Box>
    );
};

export default Calculator;
