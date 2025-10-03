"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import { toast } from "@/hooks/use-toast";
import { AIChatSession } from "@/lib/google-ai-model";
import { generateThumbnail } from "@/lib/helper";
import { ResumeDataType } from "@/types/resume.type";
import { Loader, Sparkles } from "lucide-react";
import React, { useCallback, useState } from "react";

interface SummaryItem {
  experienceLevel: string;
  summary: string;
}

const SUMMARY_PROMPT = `Job Title: {jobTitle}. Based on the job title, please generate concise 
and complete summaries for my resume as an array of objects with 'experienceLevel' and 'summary' fields,
for fresher, mid, and experienced levels. Example format: [{"experienceLevel": "fresher", "summary": "..."},
{"experienceLevel": "mid", "summary": "..."}, {"experienceLevel": "experienced", "summary": "..."}].
Each summary should be limited to 3 to 4 lines, reflecting a personal tone and showcasing specific relevant
programming languages, technologies, frameworks, and methodologies without any placeholders or gaps.
Ensure that the summaries are engaging and tailored to highlight unique strengths, aspirations,
and contributions to collaborative projects, demonstrating a clear understanding of the role and industry standards.`;

interface SummaryFormProps {
  handleNext: () => void;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ handleNext }) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();

  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummaries, setAiGeneratedSummaries] = useState<SummaryItem[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!resumeInfo) return;
    
    onUpdate({
      ...resumeInfo,
      summary: e.target.value,
    });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!resumeInfo) return;

      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo.currentPosition 
        ? resumeInfo.currentPosition + 1 
        : 1;

      try {
        await mutateAsync(
          {
            currentPosition: currentNo,
            thumbnail,
            summary: resumeInfo.summary,
          },
          {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Summary updated successfully",
              });
              handleNext();
            },
            onError: () => {
              toast({
                title: "Error",
                description: "Failed to update summary",
                variant: "destructive",
              });
            },
          }
        );
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    [resumeInfo, mutateAsync, handleNext]
  );

  const generateSummaryFromAI = async () => {
    const jobTitle = resumeInfo?.personalInfo?.jobTitle;
    if (!jobTitle) {
      toast({
        title: "Error",
        description: "Job title is required to generate summary",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const prompt = SUMMARY_PROMPT.replace("{jobTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = await result.response.text();
      
      try {
        // Parse the response and ensure it's an array
        let parsedResponse = JSON.parse(responseText);
        if (!Array.isArray(parsedResponse)) {
          // If the response is not an array, try to parse it as a string containing JSON
          parsedResponse = JSON.parse(parsedResponse);
        }
        
        if (Array.isArray(parsedResponse)) {
          setAiGeneratedSummaries(parsedResponse);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast({
          title: "Error",
          description: "Failed to parse AI-generated summary",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = useCallback(
    (summary: string) => {
      if (!resumeInfo) return;
      
      onUpdate({
        ...resumeInfo,
        summary,
      });
      setAiGeneratedSummaries(null);
    },
    [onUpdate, resumeInfo]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-xl">Summary</h2>
        <p className="text-lg text-gray-600">Add summary for your resume</p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="py-4">
          <div className="flex items-end justify-between">
            <Label className="text-md text-gray-600 px-2">Add Summary</Label>
            <Button
              variant="outline"
              type="button"
              className="gap-1 text-md font-semibold"
              disabled={loading || isPending}
              onClick={generateSummaryFromAI}
            >
              <Sparkles size="15px" className="text-purple-500" />
              Generate with AI
            </Button>
          </div>
          <Textarea
            className="mt-3 min-h-36 text-md"
            required
            value={resumeInfo?.summary || ""}
            onChange={handleChange}
          />
          
          {aiGeneratedSummaries && aiGeneratedSummaries.length > 0 && (
            <div>
              <h5 className="font-semibold text-[15px] my-4">Suggestions</h5>
              {aiGeneratedSummaries.map((item, index) => (
                <Card
                  key={index}
                  role="button"
                  className="my-4 bg-primary/5 shadow-none border-primary/30 cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleSelect(item.summary)}
                >
                  <CardHeader className="py-2">
                    <CardTitle className="font-semibold text-md capitalize">
                      {item.experienceLevel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>{item.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button
            className="mt-4 text-md font-semibold py-2"
            type="submit"
            disabled={isPending || loading || resumeInfo?.status === "archived"}
          >
            {isPending && <Loader size="15px" className="animate-spin mr-2" />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SummaryForm;