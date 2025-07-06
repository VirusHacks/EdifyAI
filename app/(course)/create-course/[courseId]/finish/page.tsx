"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/configs/db"
import { CourseList } from "@/db/schema/chapter"
import { and, eq } from "drizzle-orm"
import CourseBasicInfo from "../_components/CourseBasicInfo"
import { BaseEnvironment } from "@/configs/BaseEnvironment"
import { IoCopyOutline } from "react-icons/io5"
import type { CourseType } from "@/types/resume.type"
import type { ParamsType } from "../page"
import Link from "next/link"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const FinishScreen = ({ params }: { params: ParamsType }) => {
  const { user } = useKindeBrowserClient()
  const [course, setCourse] = useState<CourseType | null>(null)
  const router = useRouter()
  const { HOST_URL } = new BaseEnvironment()
  const COURSE_LINK = `${HOST_URL}/course/${course?.courseId}/start`

  useEffect(() => {
    if (params && user?.email) {
      getCourse()
    }
  }, [params, user])

  const getCourse = async () => {
    try {
      const res = await db
        .select()
        .from(CourseList)
        .where(and(eq(CourseList.courseId, params.courseId), eq(CourseList.createdBy, user?.email ?? "")))
      setCourse(res[0] as CourseType)
    } catch (error) {
      console.error("Error fetching course:", error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(COURSE_LINK)
      // You can add a toast notification here to inform the user that the link has been copied
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  if (!course) return null

  return (
    <Card className="max-w-7xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-black">
          Congratulations! Your course is ready
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <CourseBasicInfo courseInfo={course} onRefresh={getCourse} />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Course URL</h2>
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <Link href={COURSE_LINK} className="text-blue-600 hover:transitions-all hover:duration-300 hover:underline truncate">
              {COURSE_LINK}
            </Link>
            <Button variant="ghost" size="icon" onClick={handleCopyLink}>
              <IoCopyOutline className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FinishScreen

