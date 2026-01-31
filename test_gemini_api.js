// Test script to verify Google Gemini API is working
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const apiKey = "AIzaSyAoNWGLPFY_Aeml-lWuFElNmfs6PHBjXYg";

async function testGeminiAPI() {
    console.log("🧪 Testing Gemini API...");
    console.log("📍 API URL:", apiUrl);
    console.log("🔑 API Key:", apiKey ? "Present (first 10 chars: " + apiKey.substring(0, 10) + "...)" : "MISSING!");

    try {
        const testPayload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "Hello! Just say 'API is working' if you receive this."
                        }
                    ]
                }
            ]
        };

        console.log("📤 Sending test request...");
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testPayload)
        });

        console.log("📊 Response Status:", response.status);
        console.log("📊 Response OK:", response.ok);

        const data = await response.json();
        console.log("📦 Full Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error("❌ API Error:", data.error);
            if (data.error?.code === 400) {
                console.error("⚠️  Bad Request - Check API endpoint or payload format");
            } else if (data.error?.code === 403) {
                console.error("⚠️  Forbidden - API Key might be invalid or doesn't have permission");
            } else if (data.error?.code === 404) {
                console.error("⚠️  Not Found - Model name might be incorrect");
            }
            return;
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            console.log("✅ SUCCESS! API Response:", responseText);
        } else {
            console.log("⚠️  Response structure unexpected:", data);
        }

    } catch (error) {
        console.error("❌ Network or Fetch Error:", error.message);
        console.error("Full error:", error);
    }
}

testGeminiAPI();
