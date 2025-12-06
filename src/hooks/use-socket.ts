import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '@/lib/socket';
import type {
  OnlineUser,
  ChatMessage,
  LastMessage,
} from '@/types/chat';

interface FileMessage {
  from: {
    socketId: string;
    username: string;
    avatar?: string;
  };
  fileName: string;
  fileData: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
}

interface ImageMessage {
  from: {
    socketId: string;
    username: string;
    avatar?: string;
  };
  imageName: string;
  imageData: string;
  imageType: string;
  imageSize: number;
  timestamp: string;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ socketId: string; username: string } | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({});
  // Lưu lịch sử chat theo roomId
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});

  const socketRef = useRef<Socket | null>(null);
  const currentRoomIdRef = useRef<string | null>(null);

  // Helper function to convert LastMessage to ChatMessage
  const convertLastMessageToChatMessage = (
    lastMessage: LastMessage
  ): ChatMessage => ({
    from: lastMessage.from,
    message:
      lastMessage.type === 'text' ? lastMessage.content : undefined,
    emoji: lastMessage.type === 'emoji' ? lastMessage.emoji : undefined,
    timestamp: lastMessage.timestamp,
    type: lastMessage.type,
    fileName: lastMessage.fileName,
    imageName: lastMessage.imageName,
  });

  // Helper function to update last message
  const updateLastMessage = (
    roomId: string,
    message: ChatMessage | LastMessage
  ) => {
    setLastMessages((prev) => ({
      ...prev,
      [roomId]: {
        from: message.from,
        content:
          'content' in message
            ? message.content
            : message.message || message.emoji || '',
        type: message.type || 'text',
        timestamp: message.timestamp,
        fileName: 'fileName' in message ? message.fileName : undefined,
        imageName: 'imageName' in message ? message.imageName : undefined,
        emoji: 'emoji' in message ? message.emoji : undefined,
      },
    }));
  };

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chat-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setChatHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage:', error);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chat-history', JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Failed to save chat history to localStorage:', error);
    }
  }, [chatHistory]);

  // Initialize socket only once
  useEffect(() => {
    const newSocket = createSocket();
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // User management handlers
    newSocket.on('usernameSet', (data: {
      socketId: string;
      username: string;
    }) => {
      setCurrentUser(data);
      newSocket.emit('getOnlineUsers');
    });

    newSocket.on('onlineUsers', (users: OnlineUser[]) => {
      setOnlineUsers(users || []);
    });

    newSocket.on('userConnected', () => {
      if (currentUser) {
        newSocket.emit('getOnlineUsers');
      }
    });

    newSocket.on('userDisconnected', () => {
      if (currentUser) {
        newSocket.emit('getOnlineUsers');
      }
    });

    // Chat handlers
    newSocket.on('chatJoined', (data: {
      roomId: string;
      participants: Array<{ socketId: string; username: string }>;
      lastMessage: LastMessage | null;
    }) => {
      setCurrentRoomId(data.roomId);
      currentRoomIdRef.current = data.roomId;
      
      // Load lịch sử chat từ state nếu có
      setChatHistory((prev) => {
        const history = prev[data.roomId] || [];
        // Nếu có lastMessage và chưa có trong history, thêm vào
        if (data.lastMessage) {
          updateLastMessage(data.roomId, data.lastMessage);
          const lastMsg = convertLastMessageToChatMessage(data.lastMessage);
          // Kiểm tra xem message đã tồn tại chưa
          const exists = history.some(
            (msg) => msg.timestamp === lastMsg.timestamp && 
                     msg.from.socketId === lastMsg.from.socketId
          );
          if (!exists && history.length === 0) {
            // Chỉ thêm nếu chưa có messages trong history
            return {
              ...prev,
              [data.roomId]: [lastMsg],
            };
          }
        }
        // Set messages từ history
        setMessages(history);
        return prev;
      });
    });

    newSocket.on('receiveMessage', (data: ChatMessage) => {
      const roomId = currentRoomIdRef.current;
      if (roomId) {
        // Update messages cho room hiện tại
        setMessages((prev) => {
          const newMessages = [...prev, data];
          // Lưu vào chat history
          setChatHistory((prevHistory) => ({
            ...prevHistory,
            [roomId]: newMessages,
          }));
          return newMessages;
        });
        updateLastMessage(roomId, data);
      }
    });

    newSocket.on('receiveFile', (data: FileMessage) => {
      const roomId = currentRoomIdRef.current;
      const chatMessage: ChatMessage = {
        from: data.from,
        message: `📎 ${data.fileName}`,
        timestamp: data.timestamp,
        type: 'file',
        fileName: data.fileName,
        fileData: data.fileData,
        fileType: data.fileType,
        fileSize: data.fileSize,
      };
      if (roomId) {
        setMessages((prev) => {
          const newMessages = [...prev, chatMessage];
          setChatHistory((prevHistory) => ({
            ...prevHistory,
            [roomId]: newMessages,
          }));
          return newMessages;
        });
        updateLastMessage(roomId, {
          ...chatMessage,
          content: `📎 ${data.fileName}`,
        });
      }
    });

    newSocket.on('receiveImage', (data: ImageMessage) => {
      const roomId = currentRoomIdRef.current;
      const chatMessage: ChatMessage = {
        from: data.from,
        message: `🖼️ ${data.imageName}`,
        timestamp: data.timestamp,
        type: 'image',
        imageName: data.imageName,
        imageData: data.imageData,
        imageType: data.imageType,
        imageSize: data.imageSize,
      };
      if (roomId) {
        setMessages((prev) => {
          const newMessages = [...prev, chatMessage];
          setChatHistory((prevHistory) => ({
            ...prevHistory,
            [roomId]: newMessages,
          }));
          return newMessages;
        });
        updateLastMessage(roomId, {
          ...chatMessage,
          content: `🖼️ ${data.imageName}`,
        });
      }
    });

    newSocket.on('receiveEmoji', (data: {
      from: { socketId: string; username: string; avatar?: string };
      emoji: string;
      timestamp: string;
    }) => {
      const roomId = currentRoomIdRef.current;
      const chatMessage: ChatMessage = {
        from: data.from,
        emoji: data.emoji,
        timestamp: data.timestamp,
        type: 'emoji',
      };
      if (roomId) {
        setMessages((prev) => {
          const newMessages = [...prev, chatMessage];
          setChatHistory((prevHistory) => ({
            ...prevHistory,
            [roomId]: newMessages,
          }));
          return newMessages;
        });
        updateLastMessage(roomId, {
          ...chatMessage,
          content: data.emoji,
        });
      }
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error);
    });

    newSocket.on('logoutSuccess', () => {
      // Reset state khi logout thành công
      setCurrentUser(null);
      setOnlineUsers([]);
      setCurrentRoomId(null);
      setMessages([]);
      setLastMessages({});
      setChatHistory({});
      setIsConnected(false);
      // Clear localStorage
      localStorage.removeItem('chat-history');
    });

    return () => {
      // Chỉ đóng socket khi component unmount, không đóng khi dependencies thay đổi
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependencies - chỉ chạy một lần khi mount

  // Update ref khi currentRoomId thay đổi
  useEffect(() => {
    currentRoomIdRef.current = currentRoomId;
  }, [currentRoomId]);

  const connect = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.disconnect();
    }
  }, []);

  const setUsername = useCallback((username: string, avatar?: string) => {
    if (socketRef.current) {
      // Đảm bảo socket đã kết nối trước khi emit
      if (socketRef.current.connected) {
        socketRef.current.emit('setUsername', { username, avatar });
      } else {
        // Nếu chưa kết nối, kết nối trước rồi mới emit
        socketRef.current.connect();
        socketRef.current.once('connect', () => {
          socketRef.current?.emit('setUsername', { username, avatar });
        });
      }
    }
  }, []);

  const joinChat = useCallback((targetSocketId: string) => {
    if (socketRef.current && currentUser) {
      // Không clear messages nữa, sẽ load từ history khi join
      socketRef.current.emit('joinChat', { targetSocketId });
    }
  }, [currentUser]);

  const sendMessage = useCallback((message: string, type: 'text' | 'emoji' = 'text') => {
    if (socketRef.current && currentRoomId) {
      socketRef.current.emit('sendMessage', {
        roomId: currentRoomId,
        message,
        type,
      });
    }
  }, [currentRoomId]);

  const sendFile = useCallback((file: File) => {
    if (socketRef.current && currentRoomId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        socketRef.current?.emit('sendFile', {
          roomId: currentRoomId,
          fileName: file.name,
          fileData: base64Data,
          fileType: file.type,
          fileSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [currentRoomId]);

  const sendImage = useCallback((file: File) => {
    if (socketRef.current && currentRoomId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        socketRef.current?.emit('sendImage', {
          roomId: currentRoomId,
          imageName: file.name,
          imageData: base64Data,
          imageType: file.type,
          imageSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [currentRoomId]);

  const sendEmoji = useCallback((emoji: string) => {
    if (socketRef.current && currentRoomId) {
      socketRef.current.emit('sendEmoji', {
        roomId: currentRoomId,
        emoji,
      });
    }
  }, [currentRoomId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentRoomId(null);
    currentRoomIdRef.current = null;
  }, []);

  const getChatHistory = useCallback((roomId: string): ChatMessage[] => {
    return chatHistory[roomId] || [];
  }, [chatHistory]);

  const logout = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      // Emit logout event trước khi disconnect
      socketRef.current.emit('logout');
      // Disconnect sau một chút để đảm bảo event được gửi
      setTimeout(() => {
        socketRef.current?.disconnect();
      }, 100);
    } else {
      // Nếu chưa kết nối, chỉ reset state
      setCurrentUser(null);
      setOnlineUsers([]);
      setCurrentRoomId(null);
      setMessages([]);
      setLastMessages({});
      setIsConnected(false);
    }
  }, []);

  return {
    socket,
    isConnected,
    currentUser,
    onlineUsers,
    currentRoomId,
    messages,
    lastMessages,
    chatHistory,
    connect,
    disconnect,
    setUsername,
    joinChat,
    sendMessage,
    sendFile,
    sendImage,
    sendEmoji,
    clearMessages,
    getChatHistory,
    logout,
  };
}

