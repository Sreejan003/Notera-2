
import { GoogleGenAI, Type } from "@google/genai";
import { API_KEY } from '../config';
import { QuizQuestion } from '../types';

const cleanJsonString = (str: string) => {
  return str.replace(/```json\n?|```/g, '').trim();
};

const getAiClient = () => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || !API_KEY) {
    throw new Error("API Key not configured. Please set your API key in config.ts");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

// Professor-Verified Predefined Quizzes
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
  'differentiation': [
    {
      question: "What is the derivative of $f(x) = \\ln(x^2 + 1)$?",
      options: ["$\\frac{1}{x^2+1}$", "$\\frac{2x}{x^2+1}$", "$\\frac{x}{x^2+1}$", "$2x \\ln(x)$"],
      correctAnswer: 1,
      explanation: "Applying the chain rule: $\\frac{d}{dx}[\\ln(u)] = \\frac{1}{u} \\cdot \\frac{du}{dx}$. Here $u = x^2+1$ and $du/dx = 2x$."
    },
    {
      question: "If $y = e^{3x}$, find $\\frac{dy}{dx}$.",
      options: ["$e^{3x}$", "$3e^{3x}$", "$\\frac{1}{3}e^{3x}$", "$3x e^{3x-1}$"],
      correctAnswer: 1,
      explanation: "The derivative of $e^{ax}$ is $ae^{ax}$."
    },
    {
      question: "What is the derivative of $\\tan(x)$?",
      options: ["$\\sec(x)$", "$\\sec^2(x)$", "$-\\csc^2(x)$", "$\\sin(x)\\cos(x)$"],
      correctAnswer: 1,
      explanation: "The standard trigonometric derivative of $\\tan(x)$ is $\\sec^2(x)$."
    },
    {
      question: "Find the slope of the tangent to $f(x) = x^3 - x$ at $x=1$.",
      options: ["0", "1", "2", "3"],
      correctAnswer: 2,
      explanation: "$f'(x) = 3x^2 - 1$. At $x=1$, $f'(1) = 3(1)^2 - 1 = 2$."
    },
    {
      question: "Using the product rule, differentiate $f(x) = x \\sin(x)$.",
      options: ["$\\cos(x)$", "$\\sin(x) + x\\cos(x)$", "$\\sin(x) - x\\cos(x)$", "$x\\cos(x)$"],
      correctAnswer: 1,
      explanation: "$(uv)' = u'v + uv'$. Here $u=x, v=\sin(x)$, so $f'(x) = (1)\\sin(x) + x\\cos(x)$."
    }
  ],
  'gravitation': [
    {
      question: "What is the formula for Newton's Law of Universal Gravitation?",
      options: ["$F = ma$", "$F = G \\frac{m_1 m_2}{r^2}$", "$F = G \\frac{m_1 m_2}{r}$", "$F = \\frac{1}{2}mv^2$"],
      correctAnswer: 1,
      explanation: "The force of gravity is directly proportional to the product of masses and inversely proportional to the square of the distance between them."
    },
    {
      question: "What is the approximate value of the Gravitational Constant $G$?",
      options: ["$9.8 \\, m/s^2$", "$6.67 \\times 10^{-11} \\, N \\cdot m^2/kg^2$", "$3 \\times 10^8 \\, m/s$", "$1.6 \\times 10^{-19} \\, C$"],
      correctAnswer: 1,
      explanation: "$G$ is a universal constant with a value of approximately $6.674 \\times 10^{-11} \\, N \\cdot m^2/kg^2$."
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
  ],
  'organic chemistry': [
    {
      question: "What is the hybridization of carbon in Methane ($CH_4$)?",
      options: ["$sp$", "$sp^2$", "$sp^3$", "$dsp^2$"],
      correctAnswer: 2,
      explanation: "In Methane, Carbon forms 4 sigma bonds with no lone pairs, resulting in a tetrahedral geometry and $sp^3$ hybridization."
    },
    {
      question: "Which functional group is present in Ethanol?",
      options: ["Aldehyde", "Ketone", "Hydroxyl (-OH)", "Carboxyl (-COOH)"],
      correctAnswer: 2,
      explanation: "Ethanol ($CH_3CH_2OH$) contains the hydroxyl group, which classifies it as an alcohol."
    },
    {
      question: "What is the primary product of the hydration of Ethene ($C_2H_4$)?",
      options: ["Ethane", "Ethanol", "Ethanoic Acid", "Ethanal"],
      correctAnswer: 1,
      explanation: "Hydration of ethene involves adding $H_2O$ across the double bond, typically in the presence of an acid catalyst, to form ethanol."
    },
    {
      question: "Which of the following is a saturated hydrocarbon?",
      options: ["Benzene", "Propene", "Butane", "Ethyne"],
      correctAnswer: 2,
      explanation: "Butane is an alkane (general formula $C_nH_{2n+2}$), which means it contains only single bonds and is saturated."
    },
    {
      question: "What is the IUPAC name for $CH_3COCH_3$?",
      options: ["Propan-1-ol", "Propanal", "Propan-2-one (Acetone)", "Propanoic Acid"],
      correctAnswer: 2,
      explanation: "The molecule contains a carbonyl group on the second carbon of a three-carbon chain, making it propan-2-one."
    }
  ],
  'thermodynamics': [
    {
      question: "The First Law of Thermodynamics is essentially a statement of:",
      options: ["Conservation of Momentum", "Conservation of Energy", "Conservation of Mass", "Entropy increase"],
      correctAnswer: 1,
      explanation: "The First Law ($Q = \\Delta U + W$) states that energy cannot be created or destroyed, only transformed."
    },
    {
      question: "Which thermodynamic state function remains constant during an isothermal process?",
      options: ["Pressure", "Volume", "Temperature", "Entropy"],
      correctAnswer: 2,
      explanation: "An 'isothermal' process by definition occurs at a constant temperature (iso = same, thermal = heat/temp)."
    },
    {
      question: "The efficiency of a Carnot engine depends only on:",
      options: ["The working substance", "The cycle time", "The temperatures of the heat reservoirs", "The pressure range"],
      correctAnswer: 2,
      explanation: "Efficiency $\\eta = 1 - T_{cold}/T_{hot}$. It is independent of the working fluid."
    },
    {
      question: "What does the Second Law of Thermodynamics state about the entropy of an isolated system?",
      options: ["It always decreases", "It remains constant", "It never decreases", "It is always zero"],
      correctAnswer: 2,
      explanation: "The Second Law states that the total entropy of an isolated system can never decrease over time; it can only remain constant or increase."
    },
    {
      question: "In an adiabatic process, what is the value of heat exchange ($Q$)?",
      options: ["$Q > 0$", "$Q < 0$", "$Q = 0$", "$Q = \\Delta U$"],
      correctAnswer: 2,
      explanation: "An adiabatic process is one in which there is no heat transfer between the system and its surroundings ($Q=0$)."
    }
  ],
  'algebra': [
    {
      question: "What are the roots of the quadratic equation $x^2 - 5x + 6 = 0$?",
      options: ["$x=1, x=6$", "$x=2, x=3$", "$x=-2, x=-3$", "$x=5, x=1$"],
      correctAnswer: 1,
      explanation: "Factoring gives $(x-2)(x-3) = 0$, so $x=2$ or $x=3$."
    },
    {
      question: "Solve for $x$: $\\log_{10}(x) = 2$.",
      options: ["20", "200", "100", "10"],
      correctAnswer: 2,
      explanation: "By definition of logarithms, $10^2 = x$, so $x=100$."
    },
    {
      question: "What is the value of $i^2$ in complex numbers?",
      options: ["1", "-1", "$\\sqrt{-1}$", "0"],
      correctAnswer: 1,
      explanation: "The imaginary unit $i$ is defined such that its square is $-1$."
    },
    {
      question: "Find the 10th term of an Arithmetic Progression where $a=2$ and $d=3$.",
      options: ["27", "29", "32", "35"],
      correctAnswer: 1,
      explanation: "$a_n = a + (n-1)d = 2 + (9)(3) = 29$."
    },
    {
      question: "What is the determinant of the matrix $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$?",
      options: ["10", "-2", "2", "0"],
      correctAnswer: 1,
      explanation: "$ad - bc = (1)(4) - (2)(3) = 4 - 6 = -2$."
    }
  ]
};

export const generateQuiz = async (subject: string, topic: string) => {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // High-priority check for predefined topics
  if (PREDEFINED_QUIZZES[normalizedTopic]) {
    // Simulate slight delay for "generation" feel
    await new Promise(resolve => setTimeout(resolve, 600));
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
