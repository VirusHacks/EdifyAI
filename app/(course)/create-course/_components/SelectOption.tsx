"use client"

import { UserInputContext } from "@/app/(course)/_context/UserInputContext"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { UserInputType } from "@/types/resume.type"
import { useContext } from "react"

const SelectOption = () => {
  const { userInput, setUserInput } = useContext(UserInputContext)

  const handleInputChange = (fieldName: keyof UserInputType, value: string | number) => {
    setUserInput((prev) => ({ ...prev, [fieldName]: value }))
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="difficulty">🎓 Difficulty Level</Label>
          <Select
            onValueChange={(value) => handleInputChange("difficulty", value)}
            defaultValue={userInput?.difficulty}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">⏳ Course Duration</Label>
          <Select onValueChange={(value) => handleInputChange("duration", value)} defaultValue={userInput?.duration}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 Hour">1 Hour</SelectItem>
              <SelectItem value="2 Hours">2 Hours</SelectItem>
              <SelectItem value="More than 3 Hours">More than 3 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video">🎥 Add Video</Label>
          <Select onValueChange={(value) => handleInputChange("video", value)} defaultValue={userInput?.video}>
            <SelectTrigger id="video">
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalChapters">📄 No. of Chapters</Label>
          <Input
            id="totalChapters"
            type="number"
            onChange={(e) => handleInputChange("totalChapters", e.target.value)}
            defaultValue={userInput?.totalChapters}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SelectOption

