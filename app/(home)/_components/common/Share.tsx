import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useResumeContext } from "@/context/resume-info-provider";
import useUpdateDocument from "@/features/document/use-update-document";
import useOrigin from "@/hooks/use-origin";
import { toast } from "@/hooks/use-toast";
import { StatusType } from "@/types/resume.type";
import {
  Check,
  ChevronDown,
  Copy,
  Globe,
  Loader,
  ShareIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";

const Share = () => {
  const param = useParams();
  const documentId = param.documentId || "";

  const { resumeInfo, onUpdate, isLoading } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();

  const origin = useOrigin();

  const [copied, setCopied] = useState(false);

  const url = `${origin}/preview/${documentId}/resume`;

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleClick = useCallback(
    async (status: StatusType) => {
      if (!resumeInfo) return;
      await mutateAsync(
        {
          status: status,
        },
        {
          onSuccess: () => {
            onUpdate({
              ...resumeInfo,
              status: status,
            });
            toast({
              title: "Success",
              description: `Status set to ${status} successfully`,
            });
          },
          onError() {
            toast({
              title: "Error",
              description: "Failed to update status",
              variant: "destructive",
            });
          },
        }
      );
    },
    [mutateAsync, onUpdate, resumeInfo]
  );

  return (
    <Popover>
      <PopoverTrigger
        disabled={resumeInfo?.status === "archived" ? true : false}
        asChild
      >
        <Button
          disabled={
            isLoading || resumeInfo?.status === "archived" ? true : false
          }
          variant="secondary"
          className="bg-white border gap-1
                    !p-2
                    lg:w-auto lg:p-6"
        >
          <div className="flex items-center gap-1">
            <ShareIcon size="18px" />
            <span className="flex px-1 react-datepicker__year-text--highlighted text-md">Share</span>
          </div>
          <ChevronDown size="16px" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background"
        align="end"
        alignOffset={0}
        forceMount
      >
        {resumeInfo?.status === "public" ? (
          <div className="space-y-3">
            <div
              className="flex gap-x-2 items-center"
            >
              <Globe size="15px" className="text-primary animate-pulse" />
              <p className="text-lg font-semibold text-primary">
                This resume is shareable, copy the link!
              </p>
            </div>
            <div className="flex items-center w-full">
              <input
                className="flex-1 px-2 text-md
              border rounded-l-md 
              h-8 bg-muted truncate
              "
                value={url}
              />
              <Button
                className="h-8 rounded-l-none"
                disabled={copied}
                onClick={onCopy}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
            <hr className="border-muted !mb-0" />
            <Button
              size="sm"
              variant="outline"
              className="w-full border-primary 
              text-primary  
              text-md font-semibold"
              onClick={() => handleClick("private")}
              disabled={isPending}
            >
              {isPending && <Loader size="15px" className="animate-spin" />}
              Private
            </Button>
          </div>
        ) : (
          <div
            className="w-full flex flex-col gap-2
          items-center justify-center"
          >
            <Globe size="40px" />
            <div className="text-center mb-1">
              <h5 className="font-semibold text-sm">Set to Public</h5>
              <p className="text-xs text-muted-foreground">
                To share it with others, you need to make it public.
              </p>
            </div>
            <Button
              className="
            w-full h-8 !bg-black text-xs 
            dark:!bg-primary
            gap-1 font-semibold text-white
            "
              type="button"
              onClick={() => handleClick("public")}
            >
              {isPending && <Loader size="15px" className="animate-spin" />}
              Public
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Share;
