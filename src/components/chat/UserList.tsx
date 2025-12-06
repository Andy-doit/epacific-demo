import { useMemo, memo } from "react";
import { MessageSquare, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/format";
import { getInitials, createRoomId } from "@/utils/format";
import { LogoutButton } from "./LogoutButton";
import type { OnlineUser, LastMessage } from "@/types/chat";

interface UserListProps {
  currentUser: { socketId: string; username: string } | null;
  onlineUsers: OnlineUser[];
  selectedUserId?: string;
  lastMessages: Record<string, LastMessage>;
  onUserClick: (user: OnlineUser) => void;
  onLogout: () => void;
}

export const UserList = memo(function UserList({
  currentUser,
  onlineUsers,
  selectedUserId,
  lastMessages,
  onUserClick,
  onLogout,
}: UserListProps) {
  // Memoize filtered users to avoid recalculating on every render
  const filteredUsers = useMemo(() => {
    return onlineUsers.filter(
      (user) => user.socketId !== currentUser?.socketId
    );
  }, [onlineUsers, currentUser?.socketId]);

  return (
    <Card className="w-100 flex-shrink-0 shadow-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
            Chats
          </CardTitle>
          <LogoutButton currentUser={currentUser} onLogout={onLogout} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[calc(100vh-14rem)]">
              <div className="p-4 space-y-2">
                {!currentUser ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Vui lòng nhập tên để bắt đầu
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Chưa có người nào online
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const roomId = currentUser
                      ? createRoomId(currentUser.socketId, user.socketId)
                      : '';
                    const lastMessage = roomId ? lastMessages[roomId] : null;

                    return (
                      <div
                        key={user.socketId}
                        onClick={() => onUserClick(user)}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                          "hover:bg-accent/50 hover:shadow-sm",
                          selectedUserId === user.socketId &&
                            "bg-accent shadow-sm ring-1 ring-primary/20"
                        )}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                              {getInitials(user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-emerald-500 text-emerald-500 border-2 border-background rounded-full shadow-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {user.username}
                              </p>
                            </div>
                            {lastMessage && (
                              <span className="text-xs text-muted-foreground/60 shrink-0 truncate">
                                {formatTime(lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 shrink-0"
                              >
                                Online
                              </Badge>
                            </div>
                            {lastMessage && (
                              <div className="flex items-center gap-1.5 min-w-0 max-w-full overflow-hidden">
                                <span className="text-xs font-medium text-muted-foreground/80 shrink-0 whitespace-nowrap">
                                  {lastMessage.from.socketId ===
                                  currentUser?.socketId
                                    ? "You: "
                                    : ""}
                                </span>
                                <p className="text-xs text-muted-foreground/80 truncate min-w-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                                  {lastMessage.content}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="groups" className="mt-0">
            <ScrollArea className="h-[calc(100vh-14rem)]">
              <div className="p-4 space-y-2">
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Groups feature coming soon
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

