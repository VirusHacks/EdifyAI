"use client"

import { db } from "@/configs/db"
import { CourseList } from "@/db/schema/chapter"
import type { CourseType } from "@/types/resume.type"
import { eq } from "drizzle-orm"
import { useContext, useEffect, useState } from "react"
import CourseCard from "./CourseCard"
import { UserCourseListContext } from "@/app/(course)/_context/UserCourseList.context"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const UserCourseList = () => {
  const { user } = useKindeBrowserClient()
  const [courses, setCourses] = useState<CourseType[] | null>(null)
  const { setUserCourseList } = useContext(UserCourseListContext)

  useEffect(() => {
    user && getUserCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const getUserCourses = async () => {
    const res = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, user?.email ?? ""))

    setCourses(res as CourseType[])
    setUserCourseList(res as CourseType[])
  }

  if (courses?.length === 0) {
    return (
      <Card className="mt-44">
        <CardContent className="flex justify-center items-center p-6">
          <p className="text-lg text-muted-foreground">No courses found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses ? (
        courses.map((course, index) => <CourseCard key={index} course={course} onRefresh={() => getUserCourses()} />)
      ) : (
        <>
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

export default UserCourseList

