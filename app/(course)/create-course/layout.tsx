"use client"
import "regenerator-runtime/runtime"
import { useState, type ReactNode } from "react"
import { UserInputContext } from "../_context/UserInputContext"
import type { CourseType, UserInputType } from "@/types/resume.type"
import { UserCourseListContext } from "../_context/UserCourseList.context"
import { Urbanist } from "next/font/google"
import { cn } from "@/lib/utils"

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
})

const CreateCourseLayout = ({ children }: { children: ReactNode }) => {
  const [userInput, setUserInput] = useState<UserInputType>({})
  const [userCourseList, setUserCourseList] = useState<CourseType[]>([])

  return (
    <div className={cn("font-sans", urbanist.variable)}>
      <UserInputContext.Provider value={{ userInput, setUserInput }}>
        <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
          {children}
        </UserCourseListContext.Provider>
      </UserInputContext.Provider>
    </div>
  )
}

export default CreateCourseLayout

