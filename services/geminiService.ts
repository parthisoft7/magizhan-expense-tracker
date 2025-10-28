import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeTransactions = async (transactions: Transaction[]): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
    }
    
    if (transactions.length === 0) {
        return "No transactions to analyze. Add some income or expenses first!";
    }

    const formattedTransactions = transactions.map(t => 
        `- ${t.type.toUpperCase()}: ${t.description} (Category: ${t.category}, Account: ${t.account}): ₹${t.amount.toFixed(2)} on ${new Date(t.date).toLocaleDateString()}`
    ).join('\n');

    const prompt = `
        I am a finance tracker user in India. Here is my list of recent transactions in INR (both income and expenses):
        ${formattedTransactions}

        Please provide a brief, friendly analysis of my financial habits based on these transactions. Consider my income sources and spending patterns.
        Offer 2-3 actionable, simple saving or financial management tips that are relevant to my transactions.
        Keep the entire response under 150 words. Format your response using markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing transactions with Gemini API:", error);
        throw new Error("Failed to get analysis from AI. Please try again later.");
    }
};
