"use client"

import { db } from "@/configs/db"
import { CourseList } from "@/db/schema/chapter"
import type { CourseType } from "@/types/resume.type"
import { useEffect, useState } from "react"
import CourseCard from "./CourseCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ExplorePage = () => {
  const [courseList, setCourseList] = useState<CourseType[] | null>(null)
  const [pageIndex, setPageIndex] = useState(0)

  const getAllCourses = async () => {
    const result = await db
      .select()
      .from(CourseList)
      .limit(8)
      .offset(pageIndex * 8)
    setCourseList(result as CourseType[])
  }

  useEffect(() => {
    getAllCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex])

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Explore More Courses</CardTitle>
        <p className="text-muted-foreground">Explore courses built with AI by other users</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {courseList ? (
            courseList?.map((course) => (
              <CourseCard key={course.courseId} course={course} onRefresh={() => getAllCourses()} displayUser={true} />
            ))
          ) : (
            <>
              {[...Array(8)].map((_, index) => (
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

        <div className="flex justify-between mt-8 items-center">
          <Button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0} variant="outline">
            Previous
          </Button>
          <Badge variant="secondary" className="text-lg">
            Page {pageIndex + 1}
          </Badge>
          <Button onClick={() => setPageIndex(pageIndex + 1)} disabled={courseList?.length !== 8} variant="outline">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExplorePage

