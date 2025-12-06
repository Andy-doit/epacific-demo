import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/5">
      <div className="text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
          <MessageSquare className="h-8 w-8 text-primary/60" />
        </div>
        <div className="space-y-1.5">
          <p className="text-lg font-semibold">Select a user to start chatting</p>
          <p className="text-sm text-muted-foreground/80">
            Click on a user name on the left to start a conversation
          </p>
        </div>
      </div>
    </div>
  );
}

