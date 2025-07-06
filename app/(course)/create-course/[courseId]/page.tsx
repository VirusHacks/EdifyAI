"use client";

import { db } from "@/configs/db";
import { CourseList } from "@/db/schema/chapter";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { and, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { generateCourseContent } from "./_utils/generateCourseContent";
import LoadingDialog from "../_components/LoadingDialog";
import { useRouter } from "next/navigation";
import { CourseType } from "@/types/resume.type";

export type ParamsType = {
  courseId: string;
};

const CoursePageLayout = ({ params }: { params: ParamsType }) => {
  const { user } = useKindeBrowserClient();
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

  const router = useRouter();

  // Monitor user loading state
  useEffect(() => {
    if (user?.email) {
      setIsUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (params && isUserLoaded) {
      getCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, isUserLoaded]);

  const getCourse = async () => {
    if (!user?.email) {
      console.error("User email is not available");
      return;
    }
    try {
      const res = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, params.courseId),
            eq(CourseList.createdBy, user.email) // Ensure createdBy matches user email
          )
        );
      console.log("res[0]", res[0]);
      setCourse(res[0] as CourseType);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const handleGenerateCourseContent = async () => {
    try {
      await generateCourseContent(course, setLoading);
      await db
        .update(CourseList)
        .set({ isPublished: true })
        .where(eq(CourseList.courseId, params.courseId));
      router.replace(`/create-course/${params.courseId}/finish`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!course) return null;

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      <LoadingDialog loading={loading} />

      {/* Basic Info */}
      <CourseBasicInfo courseInfo={course} onRefresh={() => getCourse()} />

      {/* Course Details */}
      <CourseDetail courseDetail={course} />

      {/* List Of Lessons */}
      <ChapterList course={course} onRefresh={() => getCourse()} />

      <Button className="my-10" onClick={handleGenerateCourseContent}>
        Generate Course Content
      </Button>
    </div>
  );
};

export default CoursePageLayout;
