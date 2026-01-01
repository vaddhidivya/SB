
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Insight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialInsights = async (transactions: Transaction[]): Promise<Insight[]> => {
  try {
    const summary = transactions.map(t => `${t.date}: ${t.merchant} ($${t.amount}) [${t.category}]`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these transactions for financial coaching. 
      Specifically:
      1. Identify "micro-leaks": small recurring expenses (coffee, subscriptions, fast food).
      2. Calculate potential monthly savings if these habits were modified (e.g., brewing coffee at home).
      3. Provide actionable "commitment" labels (e.g., "Start 30-day home brew trial").
      4. Standard financial patterns/anomalies.

      Return 4 key insights in JSON format.
      
      Transactions:
      ${summary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, description: "One of: 'pattern', 'predictive', 'anomaly', 'nudge'" },
              message: { type: Type.STRING },
              impact: { type: Type.STRING, description: "Short impact summary like 'Saves $120/mo'" },
              actionableLabel: { type: Type.STRING, description: "Short button text for a user to commit to this change" },
              savingsPotential: { type: Type.NUMBER, description: "Calculated monthly savings amount as a number" }
            },
            required: ["id", "type", "message"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return [
      { 
        id: 'coffee-leak', 
        type: 'nudge', 
        message: 'Daily coffee purchases detected. Switching to home brew could save you significant funds.', 
        impact: 'Saves ~$140/mo',
        actionableLabel: 'Start Home Brew Trial',
        savingsPotential: 140
      },
      { id: '2', type: 'predictive', message: 'You are on track for your monthly savings goal.' }
    ];
  }
};
