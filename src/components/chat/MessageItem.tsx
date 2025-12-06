import { Users, File } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/format";
import { getInitials } from "@/utils/format";
import { formatFileSize } from "@/utils/format";
import type { Message, OnlineUser } from "@/types/chat";

interface MessageItemProps {
  message: Message;
  previousMessage: Message | null;
  nextMessage: Message | null;
  selectedUser?: OnlineUser | null;
}

export function MessageItem({
  message,
  previousMessage,
  nextMessage,
  selectedUser,
}: MessageItemProps) {
  const showAvatar =
    !message.isOwn &&
    (!previousMessage ||
      previousMessage.from.socketId !== message.from.socketId);
  const showTime =
    !nextMessage ||
    new Date(nextMessage.timestamp).getTime() -
      new Date(message.timestamp).getTime() >
      300000;

  return (
    <div
      className={cn("flex gap-3 group", message.isOwn && "flex-row-reverse")}
    >
      {!message.isOwn && (
        <div className="flex-shrink-0">
          {showAvatar ? (
            <Avatar className="h-10 w-10 ring-2 ring-background">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold">
                {selectedUser ? (
                  getInitials(selectedUser.username)
                ) : (
                  <Users className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-1.5 max-w-[75%]",
          message.isOwn && "items-end"
        )}
      >
        {!message.isOwn && showAvatar && (
          <p className="text-xs font-medium text-muted-foreground/70 px-1.5">
            {message.from.username}
          </p>
        )}
        <div
          className={cn(
            "rounded-2xl px-5 py-3 shadow-sm",
            message.isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card border border-border/50 rounded-bl-sm"
          )}
        >
          {message.type === "image" && message.imageData && (
            <div className="mb-2 rounded-lg overflow-hidden max-w-sm">
              <img
                src={`data:${message.imageType};base64,${message.imageData}`}
                alt={message.imageName || "Shared image"}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          {message.type === "file" && message.fileName && (
            <div
              className={cn(
                "mb-2 flex items-center gap-3 p-3 rounded-lg",
                message.isOwn
                  ? "bg-primary-foreground/10"
                  : "bg-muted/50"
              )}
            >
              <div className="flex-shrink-0">
                <File
                  className={cn(
                    "h-5 w-5",
                    message.isOwn
                      ? "text-primary-foreground"
                      : "text-primary"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    message.isOwn
                      ? "text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {message.fileName}
                </p>
                {message.fileSize && (
                  <p
                    className={cn(
                      "text-xs",
                      message.isOwn
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatFileSize(message.fileSize)}
                  </p>
                )}
              </div>
              {message.fileData && (
                <a
                  href={`data:${message.fileType};base64,${message.fileData}`}
                  download={message.fileName}
                  className={cn(
                    "text-xs px-2 py-1 rounded",
                    message.isOwn
                      ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  Download
                </a>
              )}
            </div>
          )}
          {message.type === "emoji" && message.emoji && (
            <p className="text-4xl leading-none">{message.emoji}</p>
          )}
          {message.message && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.message}
            </p>
          )}
        </div>
        {showTime && (
          <p
            className={cn(
              "text-xs text-muted-foreground/60 px-1.5",
              message.isOwn && "text-right"
            )}
          >
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}

