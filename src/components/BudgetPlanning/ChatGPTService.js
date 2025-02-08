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
                                text: `I am ${userData.name} from ${userData.city}, ${userData.state}, ${userData.country}. My income is ₹${userData.income}, I want to save ₹${userData.savingGoal} per ${userData.goalType}. My goal is: ${userData.goal}. Give me a structured budget plan.`,
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
