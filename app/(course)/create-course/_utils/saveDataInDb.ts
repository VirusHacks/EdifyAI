
import { db } from "@/configs/db";
import { CourseList } from "@/db/schema";
import { UserInputType } from "@/types/resume.type";

type UserInput = Pick<UserInputType, "topic" | "difficulty" | "category">;

type CourseData = {
  courseId: string;
  courseName: string;
  level: string;
  category: string;
  courseOutput: JSON;
  createdBy?: string;
  username?: string;
  userprofileimage?: string;
};

export async function storeDataInDatabase(
  id: string,
  userInput: UserInput,
  data: JSON,
  user: any
) {
  try {
    const result = await db.insert(CourseList).values({
      courseId: id,
      courseName: userInput.topic,
      category: userInput.category,
      level: userInput.difficulty,
      courseOutput: data,
      createdBy: user?.email,
      username: user?.given_name,
      userprofileimage: user?.picture,
    } as CourseData);
    console.log("result ",result)
    return result;
  } catch (error) {
    console.log(error);
  }
}
