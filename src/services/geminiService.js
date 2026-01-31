const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyAoNWGLPFY_Aeml-lWuFElNmfs6PHBjXYg";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-2.5-flash";
const FALLBACK_MODELS = [
    DEFAULT_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro"
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let cachedModel = null;

const getAvailableModels = async () => {
    const response = await fetch(`${API_BASE}/models?key=${API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to list models: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.models || [];
};

const pickBestModel = (models) => {
    if (!models.length) return null;

    const candidates = models.filter(m =>
        Array.isArray(m.supportedGenerationMethods) &&
        m.supportedGenerationMethods.includes("generateContent")
    );

    if (!candidates.length) return null;

    const preferred = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    for (const name of preferred) {
        const match = candidates.find(m => m.name === `models/${name}`);
        if (match) return name;
    }

    return candidates[0].name.replace("models/", "");
};

const resolveModel = async () => {
    if (cachedModel) return cachedModel;

    try {
        const models = await getAvailableModels();
        const best = pickBestModel(models);
        cachedModel = best || DEFAULT_MODEL;
    } catch (err) {
        cachedModel = DEFAULT_MODEL;
    }

    return cachedModel;
};

const runGeminiRequest = async (payload, modelOverride) => {
    const model = modelOverride || await resolveModel();
    const url = `${API_BASE}/models/${model}:generateContent?key=${API_KEY}`;
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
};

const runGeminiWithFallback = async (payload) => {
    const primaryModel = await resolveModel();
    let response = await runGeminiRequest(payload, primaryModel);

    if (response.status !== 404) return response;

    const tried = new Set([primaryModel]);
    for (const model of FALLBACK_MODELS) {
        if (!model || tried.has(model)) continue;
        tried.add(model);
        response = await runGeminiRequest(payload, model);
        if (response.status !== 404) {
            cachedModel = model;
            return response;
        }
    }

    return response;
};

/**
 * Categorizes a batch of transactions using Gemini AI with Retry Logic.
 * @param {Array<{id: string, description: string, amount: number, type: string}>} transactions 
 * @returns {Promise<Array<{id: string, category: string, merchant: string}>>}
 */
export const categorizeTransactionsBatch = async (transactions) => {
    if (!transactions || transactions.length === 0) return [];

    const simplifiedList = transactions.map(tx => ({
        id: tx.tempId || tx.id,
        desc: tx.description,
        amt: tx.amount,
        type: tx.type
    }));

    const prompt = `
    Analyze these PhonePe transactions and categorize them strictly.
    
    RETURN JSON ARRAY ONLY. Format: [{ "id": "...", "category": "...", "merchant": "..." }]
    
    Categories & Rules:
    1. "Personal Transfer": If description contains "Paid to [Person Name]" or "Received from [Person Name]".
       - Ex: "Paid to MOHD IRFAN" -> Cat: "Personal Transfer"
       - Ex: "Paid to Dr Filish Moto" -> Cat: "Personal Transfer" (It is a person, unless "Hospital/Clinic" is mentioned)
    
    2. "Groceries": General stores, Kirana, Vegetables, Fruits, Milk, Meat/Chicken.
       - Ex: "Ghar ka khana", "Tarana Store", "Blinkit", "Zepto", "Dairy", "Rehan Qureshi"
    
    3. "Pay Later/Loan": Loan repayments or BNPL apps.
       - Ex: "Snapmint", "MPOKKET", "Lazypay", "Navi", "Bajaj Finance", "KreditBee"
    
    4. "Travel": Train, Bus, Cab, Fuel.
       - Ex: "IRCTC", "Ixigo", "Indian Railways", "Uber", "Ola", "Petrol Pump"
    
    5. "Food": Restaurants, Online food, Tea.
       - Ex: "Zomato", "Swiggy", "Tea Stall", "Burger King"
    
    6. "Bills": Utilities, Recharge, Electricity.
    
    7. "Shopping": E-commerce (Amazon, Flipkart).
    
    8. "Medical": ONLY if "Pharmacy", "Hospital", "Clinic", "Lab", "Medical Store" is in the name.
       - Ex: "Apollo Pharmacy", "City Hospital", "Dr Lal PathLabs", "The Moon Medical Agency"
       - NOTE: "Paid to Dr [Name]" is usually Personal Transfer unless keyword "Hospital/Clinic" is present.
    
    9. "Entertainment": Movies, Streaming.
    
    Transactions:
    ${JSON.stringify(simplifiedList)}
    `;

    // Retry Logic for 429 Errors
    let retries = 3;
    let waitTime = 2000;

    while (retries > 0) {
        try {
            const response = await runGeminiWithFallback({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            });

            if (response.status === 429) {
                console.warn(`Rate limit hit. Retrying in ${waitTime / 1000}s...`);
                await delay(waitTime);
                waitTime *= 2; // Exponential backoff
                retries--;
                continue;
            }

            const data = await response.json();

            if (!response.ok) {
                const apiMessage = data?.error?.message || response.statusText;
                throw new Error(`Gemini API Error: ${response.status} ${apiMessage}`);
            }
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textResponse) return [];

            return JSON.parse(textResponse);

        } catch (error) {
            console.error("AI Analysis Failed (Attempt " + (4 - retries) + "):", error);
            if (retries === 1) return []; // Return empty on final fail
            await delay(waitTime);
            retries--;
        }
    }
    return [];
};
