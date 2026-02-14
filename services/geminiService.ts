
import { GoogleGenAI, Type } from "@google/genai";

const cleanJsonString = (str: string) => {
  return str.replace(/```json\n?|```/g, '').trim();
};

export const generateQuiz = async (subject: string, topic: string) => {
  // Always create a new instance right before the call to catch updated process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are an elite university professor from India. Generate a high-quality, mathematically rigorous 5-question multiple choice quiz about "${topic}" in the field of "${subject}". 
      
      IMPORTANT FORMATTING RULES:
      1. Use LaTeX for ALL mathematical expressions ($...$ for inline, $$...$$ for block).
      2. For scientific notation, ALWAYS use standard LaTeX form (e.g., $1.23 \times 10^{10}$).
      
      Ensure the questions require analytical thinking.
      Return ONLY a JSON array of objects.`,
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

    const text = cleanJsonString(response.text || '[]');
    return JSON.parse(text);
  } catch (e) {
    console.error("Quiz generation error:", e);
    throw new Error("Failed to generate quiz. Please ensure your API key is correctly configured and has credits.");
  }
};

export const solveDoubt = async (subject: string, question: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a helpful university professor from India specializing in ${subject}. Provide a mathematically and logically sound explanation for the following student question: "${question}". 
      
      IMPORTANT FORMATTING RULES:
      1. You MUST use LaTeX for ALL mathematical expressions.
      2. Use clear, step-by-step reasoning like a professional textbook entry.`,
      config: {
        temperature: 0.4,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return response.text;
  } catch (e) {
    console.error("Doubt solver error:", e);
    throw new Error("Could not reach the AI Tutor. Please verify your API key.");
  }
};

export const checkContentSafety = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a university forum moderator. Analyze this post for harassment or blatant academic dishonesty. Return JSON: { "safe": boolean, "reason": "string or null" }. Content: "${text}"`,
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

    return JSON.parse(cleanJsonString(response.text || '{"safe":true}'));
  } catch (e) {
    return { safe: true };
  }
};
