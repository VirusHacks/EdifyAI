import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserToolTip = ({
  username,
  userProfileImage,
}: {
  username: string
  userProfileImage: string
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <p className="text-sm text-muted-foreground">This Course is by</p>
            <Badge variant="secondary">{username}</Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={userProfileImage || "/userProfile.png"} alt={username} />
              <AvatarFallback>{username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{username}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default UserToolTip

