import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  
  interface MeetingModalProps {
    isOpen: boolean
    onClose: () => void
  }
  
  export default function MeetingModal({ isOpen, onClose }: MeetingModalProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>About Video Meetings</DialogTitle>
            <DialogDescription>
              Our video meeting platform allows you to:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Create instant meetings</li>
                <li>Schedule meetings for later</li>
                <li>Join meetings via link or code</li>
                <li>Share your screen</li>
                <li>Chat with participants</li>
                <li>Record meetings (premium feature)</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }
  
  