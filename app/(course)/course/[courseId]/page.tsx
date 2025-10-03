"use client"

import { db } from "@/configs/db"
import { CourseList } from "@/db/schema/chapter"
import type { CourseType } from "@/types/resume.type"
import { eq } from "drizzle-orm"
import { useEffect, useState } from "react"
import ChapterList from "../../create-course/[courseId]/_components/ChapterList"
import CourseDetail from "../../create-course/[courseId]/_components/CourseDetail"
import CourseBasicInfo from "../../create-course/[courseId]/_components/CourseBasicInfo"
import Header from "../../course-dashboard/_components/Header"
import { Card, CardContent } from "@/components/ui/card"

type CourseParams = {
  params: {
    courseId: string
  }
}

const Course = ({ params }: CourseParams) => {
  const [course, setCourse] = useState<CourseType | null>(null)
  const getCourse = async () => {
    const result = await db.select().from(CourseList).where(eq(CourseList.courseId, params.courseId))

    setCourse(result[0] as CourseType)
  }

  useEffect(() => {
    params && getCourse()
  }, [params, getCourse]) // Added getCourse to dependencies

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-muted-foreground">Loading course...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <CourseBasicInfo courseInfo={course} onRefresh={() => console.log("Refreshing")} edit={false} />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <CourseDetail courseDetail={course} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <ChapterList course={course} onRefresh={() => console.log("Refreshing")} edit={false} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Course

