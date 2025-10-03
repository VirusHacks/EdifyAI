"use client"

import { useEffect, useState, useRef } from "react"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { db } from "@/configs/db"
import { forumTopics, forumReplies } from "@/db/schema/chapter"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import io from "socket.io-client"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, Send } from "lucide-react"

type ForumProps = {
  params: { courseId: string }
}

type Topic = {
  id: string
  title: string
  content: string
  userId: string
  createdAt: Date
}

type Reply = {
  id: string
  topicId: string
  userId: string
  content: string
  createdAt: Date
}

export default function Forum({ params }: ForumProps) {
  const { user } = useKindeBrowserClient()
  const [topics, setTopics] = useState<Topic[]>([])
  const [newTopic, setNewTopic] = useState({ title: "", content: "" })
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [newReply, setNewReply] = useState("")
  const [isCreatingTopic, setIsCreatingTopic] = useState(false)
  const { toast } = useToast()
  const socketRef = useRef<ReturnType<typeof io>>()
  const replyInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTopics()
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    await fetch("/api/socket")
    socketRef.current = io()

    socketRef.current.on("receive-message", (message: Reply) => {
      setReplies((prevReplies) => [...prevReplies, message])
    })
  }

  const fetchTopics = async () => {
    const result = await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.courseId, params.courseId))
      .orderBy(forumTopics.createdAt)
    setTopics(result as Topic[])
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Please log in to create a topic", variant: "destructive" })
      return
    }
    await db.insert(forumTopics).values({
      courseId: params.courseId,
      userId: user.given_name,
      title: newTopic.title,
      content: newTopic.content,
    })
    setNewTopic({ title: "", content: "" })
    setIsCreatingTopic(false)
    fetchTopics()
    toast({ title: "Topic created successfully" })
  }

  const handleViewReplies = async (topic: Topic) => {
    setSelectedTopic(topic)
    const result = await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.topicId, topic.id))
      .orderBy(forumReplies.createdAt)
    setReplies(result as Reply[])
    socketRef.current?.emit("join-room", topic.id)
  }

  const handleSendReply = async () => {
    if (!user || !selectedTopic) {
      toast({ title: "Please log in to reply", variant: "destructive" })
      return
    }
    const reply = {
      topicId: selectedTopic.id,
      userId: user.given_name,
      content: newReply,
      createdAt: new Date(),
    }
    await db.insert(forumReplies).values(reply)
    socketRef.current?.emit("send-message", { ...reply, roomId: selectedTopic.id })
    setNewReply("")
    setReplies([...replies, reply as Reply])
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-grow flex">
        {/* Left Panel - Topics */}
        <div className="w-[380px] flex flex-col border-r border-gray-100">
          <div className="p-4 bg-gray-50 flex items-center justify-between border-b">
            <h1 className="text-xl font-semibold">Topics</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreatingTopic(true)}
              className="text-gray-600 hover:bg-gray-100"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <AnimatePresence>
              {isCreatingTopic && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleCreateTopic}
                  className="p-4 space-y-4 border-b bg-gray-50"
                >
                  <Input
                    placeholder="Topic Title"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                    required
                    className="bg-white"
                  />
                  <Textarea
                    placeholder="Topic Content"
                    value={newTopic.content}
                    onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                    required
                    className="bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsCreatingTopic(false)}>
                      Cancel
                    </Button>
                    <Button>Create</Button>
                  </div>
                </motion.form>
              )}
              <div className="space-y-1">
                {topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => handleViewReplies(topic)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedTopic?.id === topic.id ? "bg-gray-100" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          {topic.title[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{topic.title}</p>
                        <p className="text-sm text-gray-500 truncate">{topic.content}</p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </ScrollArea>
        </div>

        {/* Right Panel - Messages */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedTopic ? (
            <>
              <div className="px-6 py-3 bg-white border-b flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-emerald-100 text-emerald-600">
                    {selectedTopic.title[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-gray-900">{selectedTopic.title}</h2>
                  <p className="text-sm text-gray-500">{replies.length} replies</p>
                </div>
              </div>

              <ScrollArea className="flex-grow px-6 py-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-600">{selectedTopic.content}</p>
                  </div>

                  {replies.map((reply, index) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3"
                    >
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {reply.userId[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{reply.userId}</p>
                        <div className="bg-white rounded-lg p-3 shadow-sm inline-block">
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 bg-white border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendReply()
                  }}
                  className="max-w-3xl mx-auto flex items-center gap-2"
                >
                  <Input
                    placeholder="Type your reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    ref={replyInputRef}
                    className="flex-grow bg-gray-50"
                  />
                  <Button type="submit" size="icon" className="h-10 w-10 rounded-full">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a topic to view the discussion
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

