import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useSocket } from "@/hooks/use-socket";
import { UsernameDialog } from "@/components/UsernameDialog";
import { UserList } from "@/components/chat/UserList";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { EmptyState } from "@/components/chat/EmptyState";
import type { OnlineUser, ChatGroup, Message } from "@/types/chat";

const USERNAME_STORAGE_KEY = 'chat-username';

export function MessagesPage() {
  const {
    currentUser,
    onlineUsers,
    currentRoomId,
    messages: socketMessages,
    lastMessages,
    connect,
    setUsername,
    joinChat,
    sendMessage,
    sendFile,
    sendImage,
    sendEmoji,
    clearMessages,
    logout,
  } = useSocket();

  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection and check for username
  useEffect(() => {
    const savedUsername = localStorage.getItem(USERNAME_STORAGE_KEY);
    if (!savedUsername) {
      setShowUsernameDialog(true);
    } else {
      connect();
      setTimeout(() => {
        setUsername(savedUsername);
      }, 100);
    }
  }, [connect, setUsername]);

  // Convert socket messages to UI messages
  useEffect(() => {
    if (socketMessages && currentUser) {
      const convertedMessages: Message[] = socketMessages.map((msg, index) => ({
        id: `msg-${index}-${msg.timestamp}`,
        from: msg.from,
        message: msg.message,
        emoji: msg.emoji,
        timestamp: msg.timestamp,
        type: msg.type,
        fileName: msg.fileName,
        fileData: msg.fileData,
        fileType: msg.fileType,
        fileSize: msg.fileSize,
        imageName: msg.imageName,
        imageData: msg.imageData,
        imageType: msg.imageType,
        imageSize: msg.imageSize,
        isOwn: msg.from.socketId === currentUser.socketId,
      }));
      setMessages(convertedMessages);
    }
  }, [socketMessages, currentUser]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
    scrollToBottom();
  }, [messages, selectedUser, selectedGroup]);

  const handleUserClick = (user: OnlineUser) => {
    setSelectedUser(user);
    setSelectedGroup(null);
    clearMessages();
    joinChat(user.socketId);
    toast.success("Joined chat", {
      description: `You're now chatting with ${user.username}`,
    });
  };

  const handleSendMessage = () => {
    if (!currentRoomId || !selectedUser || !message.trim()) return;
    sendMessage(message.trim(), 'text');
      setMessage("");
  };

  const handleSendFile = (file: File) => {
    if (!currentRoomId || !selectedUser) return;
    sendFile(file);
  };

  const handleSendImage = (file: File) => {
    if (!currentRoomId || !selectedUser) return;
    sendImage(file);
  };

  const handleSendEmoji = (emoji: string) => {
    if (!currentRoomId || !selectedUser) return;
    sendEmoji(emoji);
  };

  const handleUsernameSet = (username: string) => {
    setShowUsernameDialog(false);
    connect();
    setUsername(username);
  };

  const handleLogout = () => {
    logout();
    // Xóa username khỏi localStorage
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    // Reset state
    setSelectedUser(null);
    setSelectedGroup(null);
    setMessage("");
    setMessages([]);
    // Hiển thị lại dialog nhập tên
    setShowUsernameDialog(true);
  };

  const currentChat = selectedUser || selectedGroup;

  return (
    <>
      <UsernameDialog
        open={showUsernameDialog}
        onUsernameSet={handleUsernameSet}
      />
    <div className="flex h-[calc(100vh-8rem)] gap-6">
        <UserList
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          selectedUserId={selectedUser?.socketId}
          lastMessages={lastMessages}
          onUserClick={handleUserClick}
          onLogout={handleLogout}
        />

      <Card className="flex-1 flex flex-col shadow-sm border-border/50 overflow-hidden min-h-0">
        {currentChat ? (
          <>
              <ChatHeader
                selectedUser={selectedUser}
                selectedGroup={selectedGroup}
              />
              <MessageList
                messages={messages}
                selectedUser={selectedUser}
                selectedGroup={selectedGroup}
                messagesEndRef={messagesEndRef}
                scrollAreaRef={scrollAreaRef}
                hasMore={false}
                isLoadingMore={false}
              />
              <MessageInput
                message={message}
                onMessageChange={setMessage}
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
                onSendImage={handleSendImage}
                onSendEmoji={handleSendEmoji}
                disabled={!currentRoomId || !selectedUser}
              />
          </>
        ) : (
            <EmptyState />
        )}
      </Card>
    </div>
    </>
  );
}
