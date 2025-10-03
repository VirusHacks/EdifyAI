import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/configs/db";
import { CourseList } from "@/db/schema/chapter";
import { eq } from "drizzle-orm";
import { useRouter } from 'next/navigation';
type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  questions: Array<{ question: string; options: string[]; answer: string }>;
  courseId: string;
  totalChapters: number;
};

const QuizModal = ({
  isOpen,
  onClose,
  questions,
  courseId,
  totalChapters,
}: QuizModalProps) => {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate and show results when at the last question
      let score = 0;
      answers.forEach((answer, index) => {
        if (answer === questions[index].answer) score++;
      });
      setShowResults(true);

      const percentage = (score / questions.length) * 100;
      if (percentage < 70) {
        return;
      }

      const currentProgress = await db
        .select({ progress: CourseList.progress })
        .from(CourseList)
        .where(eq(CourseList.courseId, courseId));

      if (currentProgress?.[0]) {
        const progressIncrement = 100 / totalChapters;
        let newProgress = currentProgress[0].progress + progressIncrement;
        newProgress = Math.min(newProgress, 100);

        await db
          .update(CourseList)
          .set({ progress: newProgress })
          .where(eq(CourseList.courseId, courseId));
      }

      
      // navigate to certificate page with param as course name if its the last chapter of the course 

// Check if it's the last chapter of the course
if (currentProgress?.[0] && currentProgress[0].progress >= 100 - (100 / totalChapters)) {
  router.push(`/certificate/${courseId}`);
}

}
  };

  const handleClose = () => {
    setAnswers(new Array(questions.length).fill(""));
    setShowResults(false);
    setCurrentQuestionIndex(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80"
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-[600px] max-w-full shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
          Quiz
        </h2>

        {!showResults ? (
          <>
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {currentQuestionIndex + 1}.{" "}
                  {questions[currentQuestionIndex].question}
                </h3>
                {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="block mt-2 text-gray-600 dark:text-gray-400"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={() => handleAnswerChange(currentQuestionIndex, option)}
                      className="mr-2 accent-blue-600 dark:accent-blue-400"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={() =>
                  currentQuestionIndex > 0 &&
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
                className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
                disabled={answers[currentQuestionIndex] === ""}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-lg text-center font-medium text-gray-700 dark:text-gray-200">
              Your Score:{" "}
              {answers.filter((answer, index) => answer === questions[index].answer).length}{" "}
              / {questions.length}
            </h3>
            <Button
              onClick={handleClose}
              className="mt-6 py-2 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 w-full"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;