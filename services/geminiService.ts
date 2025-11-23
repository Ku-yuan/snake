import { GoogleGenAI, Type } from "@google/genai";
import { GameTheme } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const generateGameTheme = async (prompt: string): Promise<GameTheme | null> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a color theme for a modern snake game based on this description: "${prompt}". 
      Ensure high contrast between the snake, food, and background. 
      Return hex color codes.
      IMPORTANT: The "name" field must be in Chinese (Simplified).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A creative name for the theme in Chinese" },
            backgroundColor: { type: Type.STRING, description: "Hex code for the game canvas background" },
            snakeHeadColor: { type: Type.STRING, description: "Hex code for the snake's head" },
            snakeBodyColor: { type: Type.STRING, description: "Hex code for the snake's body" },
            foodColor: { type: Type.STRING, description: "Hex code for the food item" },
            gridColor: { type: Type.STRING, description: "Hex code for the grid lines (subtle)" },
            textColor: { type: Type.STRING, description: "Hex code for UI text that contrasts with background" },
          },
          required: ["name", "backgroundColor", "snakeHeadColor", "snakeBodyColor", "foodColor", "gridColor", "textColor"],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) return null;

    const theme = JSON.parse(jsonStr) as GameTheme;
    return theme;
  } catch (error) {
    console.error("Failed to generate theme:", error);
    return null;
  }
};