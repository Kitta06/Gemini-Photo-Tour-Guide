
import { GoogleGenAI, Modality } from "@google/genai";
import type { Source } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image to identify the landmark.
 * @param base64Image The base64 encoded image data.
 * @returns The name of the landmark.
 */
export async function analyzeImage(base64Image: string): Promise<string> {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  const textPart = {
    text: 'Identify the landmark in this photo. Respond with only the name and location (e.g., city, country) of the landmark. Do not add any other descriptive text.'
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text.trim();
}

/**
 * Fetches the history of a landmark using Google Search grounding.
 * @param landmarkName The name of the landmark.
 * @returns An object containing the history text and grounding sources.
 */
export async function fetchLandmarkHistory(landmarkName: string): Promise<{ text: string; sources: Source[] }> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide a concise and interesting history of ${landmarkName}. Focus on key historical facts, its purpose, and significant events. Format the output in markdown.`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = groundingChunks.map((chunk: any) => chunk);
    
    return { text, sources };
}


/**
 * Generates speech from text using the TTS model.
 * @param text The text to convert to speech.
 * @returns A base64 encoded string of the audio data.
 */
export async function generateSpeech(text: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read the following text in a clear, engaging, and friendly tone, as if you were a tour guide: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Failed to generate audio. The response did not contain audio data.");
    }
    return base64Audio;
}
