/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { WasteCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ClassificationResult {
  category: WasteCategory;
  explanation: string;
  confidence: number;
}

export async function classifyWaste(base64Image: string): Promise<ClassificationResult> {
  const prompt = `Classify the waste in this image into one of these categories:
- organik: organic waste like food scraps, leaves.
- daur_ulang: recyclable waste like plastic bottles, paper, glass, metal.
- b3: hazardous waste like batteries, electronics, chemicals.
- residu: non-recyclable waste like diapers, used tissues, cigarette butts.

Provide the classification, a brief explanation, and confidence score.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            enum: ["organik", "daur_ulang", "b3", "residu"],
          },
          explanation: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: ["category", "explanation", "confidence"],
      },
    },
  });

  return JSON.parse(response.text);
}
