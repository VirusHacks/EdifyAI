"use client"

import { useContext, useEffect, useState } from "react"
import { stepperOptions } from "./_constants/stepperOptions"
import { Button } from "@/components/ui/button"
import SelectCategory from "./_components/SelectCategory"
import TopicDesc from "./_components/TopicDesc"
import SelectOption from "./_components/SelectOption"
import { UserInputContext } from "../_context/UserInputContext"
import { FaWandMagicSparkles } from "react-icons/fa6"
import { generateCourseLayout } from "@/configs/ai-models"
import LoadingDialog from "./_components/LoadingDialog"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { storeDataInDatabase } from "./_utils/saveDataInDb"
import uuid4 from "uuid4"
import { useRouter } from "next/navigation"
import { db } from "@/configs/db"
import { CourseList } from "@/db/schema/chapter"
import { eq } from "drizzle-orm"
import type { CourseType } from "@/types/resume.type"
import { UserCourseListContext } from "../_context/UserCourseList.context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CreateCoursePage = () => {
  const [step, setStep] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const { userInput } = useContext(UserInputContext)
  const { userCourseList, setUserCourseList } = useContext(UserCourseListContext)
  const { user } = useKindeBrowserClient()
  const router = useRouter()

  const getUserCourses = async () => {
    if (!user?.email) return
    const res = await db.select().from(CourseList).where(eq(CourseList.createdBy, user.email))
    setUserCourseList(res as CourseType[])
  }

  useEffect(() => {
    if (user?.email) {
      getUserCourses()
    }
  }, [user, getUserCourses]) // Added getUserCourses to dependencies

  const allowNextStep = () => {
    if (step === 0) return userInput?.category?.length > 0
    if (step === 1) return !!userInput?.topic && !!userInput?.description
    if (step === 2)
      return !!userInput?.difficulty && !!userInput?.duration && !!userInput?.video && !!userInput?.totalChapters
    return false
  }

  const generateCourse = async () => {
    const BASIC_PROMPT = `Generate a course tutorial on following details with field name, description, along with the chapter name about and duration: Category '${userInput?.category}' Topic '${userInput?.topic}' Description '${userInput.description}' Level '${userInput?.difficulty}' Duration '${userInput?.duration}' chapters '${userInput?.totalChapters}' in JSON format.\n`
    setLoading(true)
    try {
      const id = uuid4()
      const result = await generateCourseLayout.sendMessage(BASIC_PROMPT)
      const data = JSON.parse(result.response.text())
      await storeDataInDatabase(id, userInput, data, user)
      router.replace(`/create-course/${id}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-black/90">Create Course</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex justify-center">
          {stepperOptions.map((option, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center w-24 md:w-32">
                <div className={`p-3 rounded-full text-white ${step >= index ? "bg-black" : "bg-gray-300"}`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <p className="mt-2 text-sm text-center">{option.name}</p>
              </div>
              {index !== stepperOptions.length - 1 && (
                <div className={`h-1 w-16 md:w-24 ${step > index ? "bg-black" : "bg-gray-300"}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">{step === 0 ? <SelectCategory /> : step === 1 ? <TopicDesc /> : <SelectOption />}</div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
            Previous
          </Button>
          {stepperOptions.length - 1 === step ? (
            <Button onClick={generateCourse} disabled={!allowNextStep() || loading} className="gap-2">
              <FaWandMagicSparkles /> Generate Course
            </Button>
          ) : (
            <Button onClick={() => setStep(step + 1)} disabled={!allowNextStep()}>
              Next
            </Button>
          )}
        </div>
      </CardContent>
      <LoadingDialog loading={loading} />
    </Card>
  )
}

export default CreateCoursePage

