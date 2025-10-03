"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from "lucide-react"
import { generateResponse, type ChatMessage } from "./actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function TeachingAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const responseCardRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        throw new Error("Speech recognition is not supported in this browser")
      }

      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("")
        setTranscript(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error)
        setError(`Microphone error: ${event.error}`)
        setIsListening(false)
      }

      synthRef.current = window.speechSynthesis
      if (!synthRef.current) {
        throw new Error("Speech synthesis is not supported in this browser")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize speech services")
    }

    return () => {
      cleanup()
    }
  }, [])

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }

  const toggleListening = async () => {
    try {
      setError(null)
      if (isListening) {
        recognitionRef.current?.stop()
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        recognitionRef.current?.start()
        setTranscript("")
      }
      setIsListening(!isListening)
    } catch (err) {
      setError("Please allow microphone access to use speech recognition")
      setIsListening(false)
    }
  }

  const handleSubmit = async () => {
    if (!transcript.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Add user message to chat history
      const userMessage: ChatMessage = { role: "user", content: transcript }
      setChatHistory((prev) => [...prev, userMessage])

      // Generate AI response
      const aiResponse = await generateResponse(transcript, chatHistory)

      // Add AI response to chat history
      const assistantMessage: ChatMessage = { role: "assistant", content: aiResponse }
      setChatHistory((prev) => [...prev, assistantMessage])

      // Speak the response
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(aiResponse)
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => {
          setError("Failed to speak the response")
          setIsSpeaking(false)
        }
        synthRef.current.speak(utterance)
      }

      // Scroll to the latest response
      responseCardRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      synthRef.current?.cancel()
      setIsSpeaking(false)
    } else if (chatHistory.length > 0) {
      const lastResponse = chatHistory[chatHistory.length - 1]
      if (lastResponse.role === "assistant") {
        const utterance = new SpeechSynthesisUtterance(lastResponse.content)
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => {
          setError("Failed to speak the response")
          setIsSpeaking(false)
        }
        synthRef.current?.speak(utterance)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI Teaching Assistant</h1>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                className="w-40"
                disabled={isLoading}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              <span className={cn("text-sm", isListening ? "text-green-600 font-medium" : "text-muted-foreground")}>
                {isListening ? "Listening..." : "Click to start listening"}
              </span>
            </div>

            <div className="min-h-[100px] p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {transcript || "Your speech will appear here..."}
              </p>
            </div>

            <Button onClick={handleSubmit} disabled={isLoading || !transcript} className="w-full">
              {isLoading ? "Processing..." : "Get Response"}
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {chatHistory.map((message, index) => (
            <Card
              key={index}
              className={cn("p-4", message.role === "user" ? "bg-blue-50" : "bg-white")}
              ref={index === chatHistory.length - 1 ? responseCardRef : null}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{message.role === "user" ? "You" : "AI Assistant"}</h2>
                  {message.role === "assistant" && (
                    <Button variant="ghost" size="icon" onClick={toggleSpeaking} disabled={isLoading}>
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                <div className="prose max-w-none">{message.content}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

