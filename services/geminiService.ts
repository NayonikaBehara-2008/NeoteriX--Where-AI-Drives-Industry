
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisInput, ProductFeedback } from "../types";

export const generateLoginHero = async (): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: "A hyper-realistic, high-end industrial AI interface. Mindful, futuristic architectural structure floating in a void of soft light and liquid indigo particles. Cinematic lighting, 4k, elegant and professional industrial aesthetics.",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate login image", error);
    return null;
  }
};

export const analyzeProduct = async (input: AnalysisInput): Promise<ProductFeedback> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const targetLanguage = input.language || 'English';
  
  const prompt = `
    You are NeoteriX, an elite AI Product Intelligence auditor for Industry 4.0. Your goal is to review a product and provide high-fidelity feedback in ${targetLanguage}.
    Where AI Drives Industry is our motto.
    
    Product Name: ${input.name}
    Category: ${input.category}
    Description: ${input.description}
    Code/Technical Info:
    ${input.codeOrSpecs}

    RULES FOR YOUR RESPONSE:
    1. Use professional yet simple language.
    2. Be honest but kind.
    3. Focus on industrial impact, tech logic, and human clarity.
    4. Provide the report in ${targetLanguage}.

    Provide a structured response in JSON format covering:
    - overview: A clear summary with professional industrial focus.
    - detailedDescription: A longer (4-5 sentences) explanation of the product for a public showcase.
    - readinessScore: 0 to 100.
    - metrics: Score 0-100 for ux, security, performance, marketFit, innovation.
    - strengths: List of 3-5 good things.
    - vulnerabilities: List of problems with 'issue', 'severity', 'description', 'solution', and 'codeSnippet'.
    - suggestions: List of simple 'category', 'action', 'benefit'.
    - roadmap: 3-5 simple next steps.
    - targetUsers: List of 'persona', 'reason', and 'reachOutStrategy'.
  `;

  const parts = [
    { text: prompt },
    ...input.files.map(f => ({
      inlineData: {
        mimeType: f.mimeType,
        data: f.data.split(',')[1]
      }
    }))
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          detailedDescription: { type: Type.STRING },
          readinessScore: { type: Type.NUMBER },
          metrics: {
            type: Type.OBJECT,
            properties: {
              ux: { type: Type.NUMBER },
              security: { type: Type.NUMBER },
              performance: { type: Type.NUMBER },
              marketFit: { type: Type.NUMBER },
              innovation: { type: Type.NUMBER }
            },
            required: ["ux", "security", "performance", "marketFit", "innovation"]
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          vulnerabilities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                issue: { type: Type.STRING },
                severity: { type: Type.STRING },
                description: { type: Type.STRING },
                solution: { type: Type.STRING },
                codeSnippet: { type: Type.STRING }
              },
              required: ["issue", "severity", "description", "solution"]
            }
          },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                action: { type: Type.STRING },
                benefit: { type: Type.STRING }
              },
              required: ["category", "action", "benefit"]
            }
          },
          roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
          targetUsers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                persona: { type: Type.STRING },
                reason: { type: Type.STRING },
                reachOutStrategy: { type: Type.STRING }
              },
              required: ["persona", "reason", "reachOutStrategy"]
            }
          }
        },
        required: ["overview", "detailedDescription", "readinessScore", "metrics", "strengths", "vulnerabilities", "suggestions", "roadmap", "targetUsers"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse AI response", error);
    throw new Error("Could not understand the AI's report. Please try again.");
  }
};
