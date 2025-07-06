"use client"
import "regenerator-runtime/runtime"
import { useState, type ReactNode } from "react"
import { UserCourseListContext } from "../_context/UserCourseList.context"
import type { CourseType } from "@/types/resume.type"
import { Urbanist } from "next/font/google"
import { cn } from "@/lib/utils"

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
})

const courseDashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [userCourseList, setUserCourseList] = useState<CourseType[]>([])
  return (
    <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
      <div className={cn("bg-background max-w-[90%] mx-auto px-12 mt-8 font-sans", urbanist.variable)}>
        <div>{children}</div>
      </div>
    </UserCourseListContext.Provider>
  )
}

export default courseDashboardLayout

