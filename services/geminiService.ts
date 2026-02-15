
import { GoogleGenAI, Type } from "@google/genai";
import { API_KEY } from '../config';
import { QuizQuestion } from '../types';

const cleanJsonString = (str: string) => {
  return str.replace(/```json\n?|```/g, '').trim();
};

const getAiClient = () => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error("API Key not configured. Please set your API key in config.ts");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

// Hardcoded Quizzes
const PREDEFINED_QUIZZES: Record<string, QuizQuestion[]> = {
  'integration': [
    {
      question: "What is the result of the indefinite integral $\\int x^n \\, dx$ for $n \\neq -1$?",
      options: ["$\\frac{x^{n+1}}{n+1} + C$", "$nx^{n-1} + C$", "$x^{n+1} + C$", "$\\frac{x^n}{n} + C$"],
      correctAnswer: 0,
      explanation: "Using the power rule for integration, we add 1 to the exponent and divide by the new exponent."
    },
    {
      question: "Evaluate the integral $\\int \\sin(x) \\, dx$.",
      options: ["$\\cos(x) + C$", "$-\\cos(x) + C$", "$\\tan(x) + C$", "$-\\sin(x) + C$"],
      correctAnswer: 1,
      explanation: "The derivative of $-\\cos(x)$ is $\\sin(x)$, therefore the integral of $\\sin(x)$ is $-\\cos(x)$."
    },
    {
      question: "What is $\\int \\frac{1}{x} \\, dx$?",
      options: ["$x^0 + C$", "$\\ln|x| + C$", "$e^x + C$", "$-x^{-2} + C$"],
      correctAnswer: 1,
      explanation: "The integral of $1/x$ is the natural logarithm of the absolute value of $x$."
    },
    {
      question: "Evaluate $\\int e^x \\, dx$.",
      options: ["$xe^{x-1} + C$", "$\\ln(e^x) + C$", "$e^x + C$", "$\\frac{e^x}{x} + C$"],
      correctAnswer: 2,
      explanation: "The exponential function $e^x$ is unique in that its derivative and integral are both $e^x$."
    },
    {
      question: "What is the value of $\\int_0^1 x^2 \\, dx$?",
      options: ["1", "1/2", "1/3", "1/4"],
      correctAnswer: 2,
      explanation: "Integration gives $[x^3/3]_0^1 = 1/3 - 0 = 1/3$."
    }
  ],
  'gravitation': [
    {
      question: "What is the formula for Newton's Law of Universal Gravitation?",
      options: ["$F = ma$", "$F = G \\frac{m_1 m_2}{r^2}$", "$F = G \\frac{m_1 m_2}{r}$", "$F = \frac{1}{2}mv^2$"],
      correctAnswer: 1,
      explanation: "The force of gravity is directly proportional to the product of masses and inversely proportional to the square of the distance between them."
    },
    {
      question: "What is the approximate value of the Gravitational Constant $G$?",
      options: ["$9.8 \\, m/s^2$", "$6.67 \\times 10^{-11} \\, N \\cdot m^2/kg^2$", "$3 \\times 10^8 \\, m/s$", "$1.6 \\times 10^{-19} \\, C$"],
      correctAnswer: 1,
      explanation: "$G$ is a universal constant with a value of approximately $6.674 \\times 10^{-11}$."
    },
    {
      question: "How does acceleration due to gravity ($g$) change as you move away from the Earth's surface?",
      options: ["It increases", "It remains constant", "It decreases", "It becomes zero immediately"],
      correctAnswer: 2,
      explanation: "Since $g = GM/r^2$, as distance $r$ increases, $g$ decreases following the inverse square law."
    },
    {
      question: "What is the escape velocity of Earth (approximate)?",
      options: ["$9.8 \\, km/s$", "$11.2 \\, km/s$", "$5.5 \\, km/s$", "$29.8 \\, km/s$"],
      correctAnswer: 1,
      explanation: "Escape velocity is the minimum speed needed for an object to break free from Earth's gravitational pull, approximately $11.2 \\, km/s$."
    },
    {
      question: "Kepler's Third Law states that the square of the orbital period ($T^2$) is proportional to:",
      options: ["The mass of the planet", "The radius of the planet", "The cube of the semi-major axis ($a^3$)", "The square of the distance"],
      correctAnswer: 2,
      explanation: "$T^2 \\propto a^3$. The square of the time period is proportional to the cube of the average distance from the Sun."
    }
  ]
};

export const generateQuiz = async (subject: string, topic: string) => {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Check for predefined topics
  if (PREDEFINED_QUIZZES[normalizedTopic]) {
    // Simulate slight delay for "generation" feel
    await new Promise(resolve => setTimeout(resolve, 800));
    return PREDEFINED_QUIZZES[normalizedTopic];
  }

  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are an elite university professor from India. Generate a high-quality, mathematically rigorous 5-question multiple choice quiz about "${topic}" in the field of "${subject}". 
      
      IMPORTANT FORMATTING RULES:
      1. Use LaTeX for ALL mathematical expressions ($...$ for inline, $$...$$ for block).
      2. For scientific notation, ALWAYS use standard LaTeX form (e.g., $1.23 \\times 10^{10}$).
      
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
  const ai = getAiClient();
  
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
  const ai = getAiClient();
  
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
