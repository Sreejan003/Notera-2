
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuiz = async (subject: string, topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 5-question multiple choice quiz about ${topic} in the field of ${subject}. Return ONLY a JSON array of objects with 'question', 'options' (array of 4), 'correctAnswer' (0-3 index), and 'explanation'.`,
    config: {
      responseMimeType: "application/json",
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

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const checkContentSafety = async (text: string): Promise<{ safe: boolean; reason?: string }> => {
  const ai = getAI();
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
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '{"safe":true}');
  } catch (e) {
    return { safe: true };
  }
};
