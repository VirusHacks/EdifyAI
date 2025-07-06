// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { input,course} = body;
//     // console.log('messages', messages);
//     const { category, chapters } = course.courseOutput;

//     let description = `Course: ${course.courseName} (${category})\n\n`;
  
//     chapters.forEach((chapter: { chapter_name: string; description: string; duration: string }, index: number) => {
//       description += `${index + 1}. ${chapter.chapter_name}\n`;
//       description += `   Description: ${chapter.description}\n`;
//       description += `   Duration: ${chapter.duration}\n\n`;
//     });

//     // console.log(input,description);

//     try {
//       const result = await answerQuery(description, input)

//       if (typeof result === 'object' && 'error' in result) {
//         return NextResponse.json({ error: result.error }, { status: 400 })
//       }
  
//       return NextResponse.json({ result })
//     } catch (error) {
//       console.error('Error processing chatbot query:', error)
//       return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//     }
//   }
  
import { NextRequest, NextResponse } from "next/server";
import { processDescriptionAndQuery } from "../lib/helper";
interface Chapter {
  chapter_name: string;
  description: string;
  duration: string;
}

interface Course {
  courseName: string;
  courseOutput: {
    category: string;
    chapters: Chapter[];
  };
}

interface RequestBody {
  input: string;
  course: Course;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { input, course } = body;

    const { category, chapters } = course.courseOutput;

    let description = `Course: ${course.courseName} (${category})\n\n`;

    chapters.forEach((chapter, index) => {
      description += `${index + 1}. ${chapter.chapter_name}\n`;
      description += `   Description: ${chapter.description}\n`;
      description += `   Duration: ${chapter.duration}\n\n`;
    });

    const result = await processDescriptionAndQuery(description, input);
    // console.log(result)
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error processing chatbot query:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
