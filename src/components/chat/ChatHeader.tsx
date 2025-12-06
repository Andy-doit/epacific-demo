import { Circle, Users } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/utils/format";
import type { OnlineUser, ChatGroup } from "@/types/chat";

interface ChatHeaderProps {
  selectedUser?: OnlineUser | null;
  selectedGroup?: ChatGroup | null;
}

export function ChatHeader({
  selectedUser,
  selectedGroup,
}: ChatHeaderProps) {
  const displayName = selectedUser?.username || selectedGroup?.name;
  const avatar = selectedUser?.avatar || selectedGroup?.avatar;

  return (
    <CardHeader className="border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 ring-2 ring-background shadow-sm">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
            {selectedUser ? (
              getInitials(selectedUser.username)
            ) : (
              <Users className="h-5 w-5" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{displayName}</CardTitle>
          <CardDescription className="text-sm">
            {selectedUser
              ? "Online"
              : `${selectedGroup?.members || 0} members`}
          </CardDescription>
        </div>
        {selectedUser && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
          >
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
            Online
          </Badge>
        )}
      </div>
    </CardHeader>
  );
}

