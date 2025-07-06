import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { image, dict_of_vars } = await req.json()

    if (!image || !dict_of_vars) {
      return NextResponse.json({ message: "Missing required fields", type: "error" }, { status: 400 })
    }

    // Decode base64 image
    const imageData = Buffer.from(image.split(",")[1], "base64")

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const prompt = `You have been given an image with some mathematical expressions, equations, or graphical problems. Your task is to solve them using the following rules and concepts.

    // ... (rest of the prompt remains the same)
    `

    const result = await model.generateContent([prompt, { inlineData: { data: imageData, mimeType: "image/jpeg" } }])
    const response = result.response
    const text = response.text()

    let answers
    try {
      answers = JSON.parse(text)
      if (!Array.isArray(answers)) {
        throw new Error("Response is not an array")
      }
    } catch (e) {
      console.error("Error parsing response from Gemini API:", e)
      return NextResponse.json({ message: "Invalid response from AI model", type: "error" }, { status: 500 })
    }

    for (const answer of answers) {
      if ("assign" in answer) {
        answer.assign = true
      } else {
        answer.assign = false
      }
    }

    return NextResponse.json({ message: "Image processed", type: "success", data: answers })
  } catch (e) {
    console.error("Error processing request:", e)
    return NextResponse.json({ message: "Error processing image", type: "error", error: e.toString() }, { status: 500 })
  }
}

