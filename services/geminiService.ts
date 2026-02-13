
import { GoogleGenAI, Type } from "@google/genai";

export const generateQuiz = async (subject: string, topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are an elite university professor. Generate a high-quality, mathematically rigorous 5-question multiple choice quiz about "${topic}" in the field of "${subject}". 
      If the topic involves math or logic, ensure the questions require analytical thinking.
      Return ONLY a JSON array of objects with the following keys: 'question', 'options' (array of 4 strings), 'correctAnswer' (0-3 index), and 'explanation'.`,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || '[]');
  } catch (e) {
    console.error("Quiz generation error:", e);
    throw new Error("Failed to generate quiz. Please check your connection or try a different topic.");
  }
};

export const solveDoubt = async (subject: string, question: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a helpful university professor specializing in ${subject}. Provide a mathematically and logically sound explanation for the following student question: "${question}". 
      Use step-by-step reasoning. If equations are needed, use plain text or clear notations.`,
      config: {
        temperature: 0.4,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    return response.text;
  } catch (e) {
    console.error("Doubt solver error:", e);
    throw new Error("Could not reach the AI Tutor. Please try again.");
  }
};

export const checkContentSafety = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a university forum moderator. Analyze this post for harassment, profanity, or blatant academic dishonesty. Return JSON: { "safe": boolean, "reason": "string or null" }. Content: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["safe"]
        }
      }
    });

    return JSON.parse(response.text || '{"safe":true}');
  } catch (e) {
    return { safe: true };
  }
};
