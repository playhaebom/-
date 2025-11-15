import { GoogleGenAI, Type } from "@google/genai";
import { FlashcardData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const flashcardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The question for the flashcard. It should be clear and concise."
      },
      answer: {
        type: Type.STRING,
        description: "The answer to the question. It should be accurate and to the point."
      }
    },
    required: ["question", "answer"]
  }
};

export const generateFlashcards = async (topic: string): Promise<FlashcardData[]> => {
  if (!topic) {
    throw new Error("주제는 비워 둘 수 없습니다.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a set of 10 unique flashcards for the topic: "${topic}". Each flashcard must have a distinct question and a concise answer. Focus on key concepts and important facts related to the topic.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
      },
    });

    const jsonText = response.text.trim();
    const flashcards = JSON.parse(jsonText) as FlashcardData[];
    
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error("예상된 형식으로 플래시 카드를 생성하지 못했습니다.");
    }
    
    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("플래시 카드를 생성할 수 없습니다. 주제를 확인하거나 나중에 다시 시도해주세요.");
  }
};