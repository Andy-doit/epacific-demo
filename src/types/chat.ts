export interface OnlineUser {
  socketId: string;
  username: string;
  avatar?: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  avatar?: string;
  members: number;
  lastMessage?: string;
  lastMessageSender?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface Message {
  id: string;
  from: {
    socketId: string;
    username: string;
    avatar?: string;
  };
  message?: string;
  emoji?: string;
  timestamp: string;
  type?: 'text' | 'emoji' | 'file' | 'image';
  imageData?: string;
  imageType?: string;
  imageName?: string;
  imageSize?: number;
  fileData?: string;
  fileType?: string;
  fileName?: string;
  fileSize?: number;
  isOwn: boolean;
}

export interface ChatMessage {
  from: {
    socketId: string;
    username: string;
    avatar?: string;
  };
  message?: string;
  emoji?: string;
  timestamp: string;
  type?: 'text' | 'emoji' | 'file' | 'image';
  fileName?: string;
  fileData?: string;
  fileType?: string;
  fileSize?: number;
  imageName?: string;
  imageData?: string;
  imageType?: string;
  imageSize?: number;
}

export interface LastMessage {
  from: {
    socketId: string;
    username: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'file' | 'image' | 'emoji';
  timestamp: string;
  fileName?: string;
  imageName?: string;
  emoji?: string;
}

