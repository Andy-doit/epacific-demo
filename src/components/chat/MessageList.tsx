import { useEffect, useRef, useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import type { Message, OnlineUser, ChatGroup } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  selectedUser?: OnlineUser | null;
  selectedGroup?: ChatGroup | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function MessageList({
  messages,
  selectedUser,
  selectedGroup,
  messagesEndRef,
  scrollAreaRef,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: MessageListProps) {
  const displayName = selectedUser?.username || selectedGroup?.name;
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeight = useRef<number>(0);

  // Auto scroll to bottom when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (shouldAutoScroll) {
      const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 100);
      } else if (messagesEndRef.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [messages, shouldAutoScroll, messagesEndRef, scrollAreaRef]);

  // Handle scroll detection
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearTop = scrollTop < 100;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      // User scrolled to top - load more messages
      if (isNearTop && hasMore && !isLoadingMore && onLoadMore) {
        previousScrollHeight.current = scrollHeight;
        onLoadMore();
      }

      // Update auto-scroll behavior based on scroll position
      setShouldAutoScroll(isNearBottom);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollAreaRef, hasMore, isLoadingMore, onLoadMore]);

  // Maintain scroll position when loading more messages
  useEffect(() => {
    if (isLoadingMore && scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement && previousScrollHeight.current > 0) {
        const newScrollHeight = scrollElement.scrollHeight;
        const scrollDiff = newScrollHeight - previousScrollHeight.current;
        scrollElement.scrollTop = scrollElement.scrollTop + scrollDiff;
      }
    }
  }, [messages, isLoadingMore, scrollAreaRef]);

  return (
    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gradient-to-b from-background to-muted/20 min-h-0">
      <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
        <div className="p-8 space-y-5 flex flex-col justify-end" ref={scrollContainerRef}>
          {/* Load more indicator */}
          {hasMore && (
            <div className="flex justify-center py-2">
              {isLoadingMore ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Badge variant="outline" className="text-xs bg-muted/50 border-border/50 px-3 py-1">
                  Scroll up to load more messages
                </Badge>
              )}
            </div>
          )}

          <div className="flex justify-center py-4">
            <Badge
              variant="outline"
              className="text-sm bg-muted/50 border-border/50 px-4 py-1.5"
            >
              You joined the {selectedGroup ? "group" : "chat"} with{" "}
              {displayName}
            </Badge>
          </div>
          <div className="space-y-5">
            {messages.map((msg, index) => (
              <MessageItem
                key={msg.id}
                message={msg}
                previousMessage={index > 0 ? messages[index - 1] : null}
                nextMessage={
                  index < messages.length - 1 ? messages[index + 1] : null
                }
                selectedUser={selectedUser}
              />
            ))}
            {messages.length === 0 && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground/70">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>
    </CardContent>
  );
}
