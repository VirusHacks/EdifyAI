"use client"
import { UserCourseListContext } from "@/app/(course)/_context/UserCourseList.context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useContext } from "react"
import { FaWandMagicSparkles } from "react-icons/fa6"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AddCourse = () => {
  const { userCourseList } = useContext(UserCourseListContext)
  const { isAuthenticated } = useKindeBrowserClient()

  if (!isAuthenticated) {
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Customize Your Own Course</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <p className="text-xl text-muted-foreground">Explore courses built with AI</p>
        <Link href={"/create-course"}>
          <Button className="gap-2 text-lg font-semibold">
            <FaWandMagicSparkles className="w-5 h-5" />
            Create AI course
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default AddCourse

