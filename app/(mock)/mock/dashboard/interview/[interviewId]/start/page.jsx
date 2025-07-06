"use client"; // Ensure this is client-side

import { db } from "@/configs/db";
import { MockInterview } from "@/db/schema/mock";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSections from "./_compnents/QuestionsSections";
import RecordAnswerSection from "./_compnents/RecordAnswerSection";
import { Button } from "@/components/mockui/button";
import Link from "next/link";

// Import `usePathname` from next/navigation for routing in `app` directory
import { usePathname } from "next/navigation";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Use the `usePathname` hook to get the current path
  const pathname = usePathname();

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetail();
    }
  }, [params?.interviewId]); // Ensure it runs only when interviewId changes

  const GetInterviewDetail = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        const jsonMockResp = JSON.parse(result[0]?.jsonMockResp || "{}");

        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  // Post message to the parent app after the path is determined
  useEffect(() => {
    if (pathname) {
      window.parent.postMessage(
        {
          action: "navigate",
          url: `https://gen-ed-jldi.vercel.app${pathname}`,
        },
        "*"
      );
    }
  }, [pathname]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionsSections
          activeQuestionIndex={activeQuestionIndex}
          mockInterViewQuestion={mockInterviewQuestion}
        />
        {/* Video/ Audio Recording */}
        <RecordAnswerSection
          activeQuestionIndex={activeQuestionIndex}
          mockInterViewQuestion={mockInterviewQuestion}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previous Question
          </Button>
        )}

        {mockInterviewQuestion?.interviewQuestions?.length &&
          activeQuestionIndex < mockInterviewQuestion?.interviewQuestions.length - 1 && (
            <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
              Next Question
            </Button>
          )}

        {console.log("mockInterviewQuestion", mockInterviewQuestion?.interviewQuestions)}

        {mockInterviewQuestion?.interviewQuestions?.length &&
          activeQuestionIndex === mockInterviewQuestion.interviewQuestions.length - 1 && (
            <Link href={`/mock/dashboard/interview/${interviewData?.mockId}/feedback`}>
              <Button>End Interview</Button>
            </Link>
          )}
      </div>
    </div>
  );
}

export default StartInterview;
