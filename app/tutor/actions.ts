"use server"

import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "")

const SYSTEM_PROMPT = `You are an expert teaching assistant, specializing in providing clear, concise, and focused answers.  Your goal is to understand the user's question and provide the most appropriate response, whether it's a brief "yes/no," a short explanation, a detailed analysis, or anything in between.  Pay close attention to the question type and tailor your response accordingly.

* **Clarity is paramount:**  Avoid ambiguity and get straight to the point.
* **Focus on the question:** Don't provide unnecessary information. Answer the specific question asked.
* **Adapt to the question type:**
    * **Yes/No Questions:** Answer with a clear "Yes" or "No," followed by a brief (1-2 sentence) explanation if necessary.
    * **Analytical Questions:** Provide a structured analysis, breaking down the key points and supporting your conclusions.
    * **Brief Questions:** Give a concise and direct answer.
    * **Open-ended Questions:** Provide a comprehensive and well-reasoned response.
* **Use examples where helpful:**  Illustrate your points with relevant examples to enhance understanding.
* **Maintain a professional and helpful tone:**  Be supportive and encouraging.
* **If you are unsure of the answer, say "I am not able to answer this question at this time."**

Keep your responses concise and to the point.  Avoid unnecessary fluff or filler.  Prioritize clarity and accuracy.`

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export async function generateResponse(transcript: string, history: ChatMessage[] = []) {
  try {
    let model: GenerativeModel;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    } catch (error) {
      console.warn("Failed to get gemini-1.5-pro model, falling back to gemini-pro");
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const chat = model.startChat({
      system_instruction: { parts: [SYSTEM_PROMPT] },
      history: history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(transcript);

    if (result.response && result.response.candidates && result.response.candidates.length > 0) {
      const text = result.response.candidates[0].content.parts[0].text;
      return text;
    } else {
      console.error("Unexpected response format:", result.response);
      throw new Error("Invalid or empty response from AI");
    }

  } catch (error) {
    console.error("AI Generation Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred while generating the response");
    }
  }
}

