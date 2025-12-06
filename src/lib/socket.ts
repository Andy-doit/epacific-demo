import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const createSocket = (): Socket => {
  return io(SOCKET_URL, {
    transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
};

