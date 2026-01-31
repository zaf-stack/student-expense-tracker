// const apiUrl = "https://api.openai.com/v1/chat/completions"
// const apiUrl = "https://api.deepseek.com/v1/chat/completions"
// const apiKey = "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"
// const apiKey = "sk-00634dd599c044db8e75ba23d1221f6c"

const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent";
const apiKey = "AIzaSyC4mguRjmzyCQp9h1JAOQYfXJhcMI6l0vQ"; // ✅ Google Gemini API Key (Updated)

export const getBudgetAdvice = async (userData) => {
    try {
        console.log("✅ Using Google Gemini AI API:", apiUrl);
        console.log(
            "✅ Using API Key:",
            apiKey ? "Loaded Successfully" : "Not Loaded"
        );

        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            // ✅ Query Param API Key
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: ` 
                                
                                Act as a top-class financial advisor. Follow these rules strictly:
1. Response language: ${userData.language}.
2. Consider living costs in ${userData.city}, ${userData.state}, ${userData.country}.
3. Structure the advice clearly with headings and bullet points.
4. Provide a "Top Class" implementation plan including Risk Management, Investments, and specific Savings Strategies.

                                
                                **User Profile:**
                                - Name: ${userData.name}
                                - Role: ${userData.userType}
                                - Demographics: ${userData.age} yrs, ${userData.gender}, ${userData.maritalStatus}
                                - Location: ${userData.city}, ${userData.state}, ${userData.country}
                                
                                **Financial Snapshot:**
                                - Monthly Income: ₹${userData.income}
                                - Living: ${userData.living} ${userData.rentAmount ? `(Cost: ₹${userData.rentAmount})` : ""}
                                - Fixed Costs: Utilities: ₹${userData.utilities}, Transport: ₹${userData.transportation}
                                - Liabilities: Debt: ${userData.hasDebt} ${userData.loanEMI ? `(EMI: ₹${userData.loanEMI})` : ""}
                                - Safety Net: Emergency Fund: ₹${userData.emergencyFund}
                                - Habits: ${userData.spendingHabits}
                                
                                **Goals:**
                                - Target: Save ₹${userData.savingGoal} (${userData.goalType})
                                - Main Goal: ${userData.goal}
                                
                                **Instructions:**
                                Generate a comprehensive financial plan.
                                
                                The output MUST include these sections:
                                1️⃣ **Executive Summary** (Quick health check)
                                2️⃣ **Budget Allocation (50/30/20 Rule)** (Exact numbers for Needs, Wants, Savings based on income)
                                3️⃣ **Risk Management Plan** (Emergency fund advice, Insurance suggestions based on profile)
                                4️⃣ **Investment Strategy** (Where to invest savings: Stocks, FDs, Mutual Funds, Gold? - give safe & risky options)
                                5️⃣ **Debt Repayment Strategy** (If debt exists, how to clear it fast)
                                6️⃣ **Action Plan for Goal** (Step-by-step guide to achieve "${userData.goal}")
                                
                                Keep it professional yet motivating.`,
                            },
                        ],
                    },
                ],
            }),
        });

        console.log("🔹 API Response Status:", response.status);
        const advice = await response.json();
        console.log("🔹 API Response Data:", advice);

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} - ${advice.error?.message || "Unknown error"
                }`
            );
        }

        return (
            advice.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from Gemini AI."
        );
    } catch (error) {
        console.error("❌ Error Fetching Budget Advice:", error);
        throw new Error("Failed to fetch budget plan. Please check API settings.");
    }
};
