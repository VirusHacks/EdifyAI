"use client"

import { UserInputContext } from "@/app/(course)/_context/UserInputContext"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { UserInputType } from "@/types/resume.type"
import { useContext } from "react"

const TopicDesc = () => {
  const { userInput, setUserInput } = useContext(UserInputContext)

  const handleInputChange = (fieldName: keyof UserInputType, value: string) => {
    setUserInput((prev) => ({ ...prev, [fieldName]: value }))
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Course Topic</Label>
          <Input
            id="topic"
            placeholder="Enter the topic"
            defaultValue={userInput?.topic}
            onChange={(e) => handleInputChange("topic", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            placeholder="About your course"
            defaultValue={userInput?.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default TopicDesc

