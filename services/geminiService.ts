
import { GoogleGenAI, Type } from "@google/genai";
import { NGO, RewardSource, Language, Region } from "../types";

export const generateImpactInsight = async (
  amount: number, 
  ngo: NGO, 
  source?: RewardSource, 
  lang: Language = 'en',
  region: Region = 'US'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an impact advisor. The user has donated ${amount} (in their local currency for region ${region}) to ${ngo.name} (${ngo.type}). They redirected this from ${source || 'rewards'}. 
      Explain the tangible impact in exactly 2 inspiring sentences. 
      IMPORTANT: Respond ONLY in the ${lang} language.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Impact analysis unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "...";
  }
};

export const generateImpactVideo = async (ngo: NGO): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompts: Record<string, string> = {
    'Orphanage': 'A heartwarming cinematic 3D animation of a child smiling and opening a new book in a vibrant, sunlit library, high detail, Pixar style, soft lighting.',
    'Old Age Home': 'A peaceful cinematic 3D animation of an elderly person laughing and walking in a blooming, lush garden with butterflies, golden hour lighting, high detail.',
    'Special Needs': 'A joyful cinematic 3D animation of a diverse group of children high-fiving in a colorful sensory room, soft textures, uplifting atmosphere.',
    'Education': 'A cinematic close-up of a student writing in a notebook with glowing constellations emerging from the pages, magical, high detail.',
    'Environment': 'A breathtaking time-lapse of a sapling growing into a massive tree in a pristine forest, sun rays piercing through leaves, ultra-realistic.'
  };

  const prompt = prompts[ngo.type] || prompts['Education'];

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Video Gen Error:", error);
    throw error;
  }
};

export const getPersonalizedCauseSuggestion = async (userInterests: string[], ngos: NGO[], lang: Language = 'en'): Promise<NGO> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ngoData = ngos.map(n => ({ id: n.id, name: n.name, type: n.type }));
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Pick one NGO ID from ${JSON.stringify(ngoData)} that matches interests ${userInterests.join(", ")}. Return ONLY the JSON. Respond in context of language ${lang}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedId: { type: Type.STRING }
          }
        }
      }
    });
    
    const result = JSON.parse(response.text.trim());
    return ngos.find(n => n.id === result.suggestedId) || ngos[0];
  } catch (error) {
    return ngos[0];
  }
};
