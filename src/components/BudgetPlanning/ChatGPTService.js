// const apiUrl = "https://api.openai.com/v1/chat/completions"
// const apiUrl = "https://api.deepseek.com/v1/chat/completions"
// const apiKey = "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"
// const apiKey = "sk-00634dd599c044db8e75ba23d1221f6c"

const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const apiKey = "AIzaSyAoNWGLPFY_Aeml-lWuFElNmfs6PHBjXYg"; // ✅ Google Gemini API Key

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
                                
                                Act as a financial advisor. Follow these rules strictly:
1. Response language: ${userData.language}.
2. Consider living costs in ${userData.city}, ${userData.state}, ${userData.country}.
3. Structure the advice clearly with headings and bullet points.
4. End with a motivational note to use 'Student Expense Tracker'.

                                
                                **User Information:**
                                - Name: ${userData.name}
                                - Age: ${userData.age}, Gender: ${userData.gender}, Marital Status: ${userData.maritalStatus}
                                - Location: ${userData.city}, ${userData.state}, ${userData.country}
                                - Preferred Language: ${userData.language} (Respond in this language)
                                - User Type: ${userData.userType}
                                
                                **Financial Information:**
                                - Monthly Income: ₹${userData.income}
                                - Monthly Saving Goal: ₹${userData.savingGoal} (${userData.goalType})
                                - Financial Goal: ${userData.goal}
                                - Living Situation: ${userData.living} ${userData.living === "rent" ? `(Rent: ₹${userData.rentAmount})` : ""}
                                - Has Debt/Loan: ${userData.hasDebt} ${userData.hasDebt === "yes" ? `(EMI: ₹${userData.loanEMI})` : ""}
                                - Emergency Fund: ₹${userData.emergencyFund}
                                
                                **Spending & Saving Habits:**
                                - Spending Habits: ${userData.spendingHabits}
                                
                                **Instructions:**
                                Generate a well-structured budget plan considering all the above details. Ensure that the response is in **${userData.language}**, as requested by the user. Also, take into account the **cost of living and inflation rate** in ${userData.city}, ${userData.state}, ${userData.country} while suggesting a budget plan.
                                
                                The output should be mobile-friendly and formatted with sections like:
                                1️⃣ **Summary** (Quick details about the user)
                                2️⃣ **Fixed Expenses** (Suggested allocations for rent, utilities, groceries, etc.) based on the cost of living in ${userData.city}, ${userData.state}
                                3️⃣ **Savings Plan** (How much to save monthly and best saving methods)
                                4️⃣ **Investment Suggestions** (If applicable, based on user preferences)
                                5️⃣ **Debt Management** (If the user has loans, provide a realistic repayment strategy)
                                6️⃣ **Custom Tips & Warnings** (Provide tailored financial advice for better money management considering the economic conditions of ${userData.city}, ${userData.state})
                                
                                Keep the structure clean and easy to read on mobile devices. Use bullet points, spacing, and bold text for key information.`,
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
