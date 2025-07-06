import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function processDescriptionAndQuery(description: string, query: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for a course. Use the following course description to answer questions:\n\n${description}`,
      },
      {
        role: "user",
        content: query,
      },
    ],
    model: "Llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 1000,
    top_p: 1,
    stream: false,
    stop: null,
  });

  return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
}

