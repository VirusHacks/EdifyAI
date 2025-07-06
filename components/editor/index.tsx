import React, { useState } from "react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  Separator,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
} from "react-simple-wysiwyg";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AIChatSession } from "@/lib/google-ai-model";

const PROMPT = `Given the job title "{jobTitle}", create 6-7 concise and personal bullet points in HTML stringify format that highlight my key skills, relevant technologies, and significant contributions in that role. Do not include the job title itself in the output. Provide only the bullet points inside an unordered list.`;

const RichTextEditor = (props: {
  jobTitle: string | null;
  initialValue: string;
  onEditorChange: (e: any) => void;
}) => {
  const { jobTitle, initialValue, onEditorChange } = props;

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>(initialValue || "");

  const GenerateSummaryFromAI = async () => {
    try {
      // Validate jobTitle
      if (typeof jobTitle !== "string" || jobTitle.trim() === "") {
        toast({
          title: "Must provide a valid Job Position",
          variant: "destructive",
        });
        return;
      }
  
      setLoading(true);
  
      // Replace placeholder in the prompt with the job title
      const prompt = PROMPT.replace("{jobTitle}", jobTitle.trim());
  
      // Call AI API and get the response
      const result = await AIChatSession.sendMessage(prompt);
      const responseText = await result.response.text();
  
      // Safely parse the AI response
      let generatedSummary = "";
      try {
        const parsedResponse = JSON.parse(responseText);
  
        if (parsedResponse && parsedResponse.bulletPoints) {
          generatedSummary = parsedResponse.bulletPoints;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        toast({
          title: "AI response could not be processed",
          variant: "destructive",
        });
        return;
      }
  
      // Update editor value with bullet points (HTML string)
      setValue(generatedSummary);
      onEditorChange(generatedSummary);
    } catch (error) {
      console.error("Error in GenerateSummaryFromAI:", error);
      toast({
        title: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <Label className="text-md">Work Summary</Label>
        <Button
          variant="outline"
          type="button"
          className="gap-1 text-md font-semibold"
          disabled={loading}
          onClick={GenerateSummaryFromAI}
        >
          <>
            <Sparkles size="15px" className="text-purple-500 " />
            Generate with AI
          </>
          {loading && <Loader size="13px" className="animate-spin" />}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          containerProps={{
            style: {
              resize: "vertical",
              lineHeight: 1.2,
              fontSize: "1rem",
            },
          }}
          onChange={(e) => {
            const newValue = e.target.value;
            setValue(newValue);
            onEditorChange(newValue);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;
