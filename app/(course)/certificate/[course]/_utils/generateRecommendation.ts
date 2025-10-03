import { generateRecommendations } from "@/configs/ai-models";

interface Recommendation {
  title: string;
  description: string;
category: string;
level: string;
duration: string;
}

export async function generateRecommendationsUtil(courseName: string): Promise<Recommendation[]> {
  try {
    const prompt = `Based on the course "${courseName}", suggest 3 related courses that would be beneficial for further learning. Provide the response in JSON format with an array of objects, each containing fields: title, description, and estimatedTime.`;
    
    const result = await generateRecommendations.sendMessage(prompt);
    const recommendations = JSON.parse(result.response.text());
    
    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

