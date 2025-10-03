"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"
import { X, Send, Bot, User, Mic, VolumeX } from "lucide-react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import type { CourseType } from "@/types/resume.type"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ChatbotModalProps = {
  course: CourseType
}

export default function ChatbotModal({ course }: ChatbotModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { messages, input, handleInputChange, setInput, isLoading, error } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messagesEndRef])

  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript, setInput])

  const startListening = () => {
    try {
      SpeechRecognition.startListening({ continuous: true })
    } catch (error) {
      console.error("Error starting speech recognition:", error)
    }
  }

  const stopListening = () => {
    try {
      SpeechRecognition.stopListening()
    } catch (error) {
      console.error("Error stopping speech recognition:", error)
    }
  }

  const handleVoiceInput = () => {
    if (listening) {
      stopListening()
    } else {
      resetTranscript()
      startListening()
    }
  }

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (listening) {
      stopListening()
    }
    const payload = {
      input,
      course,
    }
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      console.log("Chat response:", data.result)
      speakMessage(data.result)
      setInput("")
      messages.push({
        content: data.result,
        role: "system",
        id: (messages.length + 1).toString(),
      })
    } catch (e) {
      console.log("Error", e)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition.")
  }

  return (
    <>
      <Button className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg" onClick={() => setIsOpen(true)}>
        <Bot className="h-6 w-6" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <Card className="w-full max-w-md">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Chatbot</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start space-x-2 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role !== "user" && (
                        <div className="flex-shrink-0 bg-primary rounded-full p-2">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <div className="flex-shrink-0 bg-muted rounded-full p-2">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start space-x-2 justify-start"
                    >
                      <div className="flex-shrink-0 bg-destructive rounded-full p-2">
                        <Bot className="h-4 w-4 text-destructive-foreground" />
                      </div>
                      <div className="max-w-[75%] p-3 rounded-lg bg-muted text-destructive">
                        {error.message ||
                          "I'm sorry, but I'm having trouble connecting to my brain right now. Please try again later."}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleFormSubmit} className="flex space-x-2">
                  <Input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-grow"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleVoiceInput}>
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Send className="h-5 w-5" />
                  </Button>
                  {isSpeaking && (
                    <Button type="button" variant="destructive" size="icon" onClick={stopSpeaking}>
                      <VolumeX className="h-5 w-5" />
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

