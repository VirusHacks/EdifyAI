import { CourseType } from "@/types/resume.type";
import { createContext } from "react";

export type UserCourseListContextType = {
  userCourseList: CourseType[];
  setUserCourseList: (value: CourseType[]) => void;
};

export const UserCourseListContext = createContext<UserCourseListContextType>({
  userCourseList: [],
  setUserCourseList: () => {},
});
