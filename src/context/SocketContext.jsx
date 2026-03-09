import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('elevatex_token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      // Join personal notification room
      if (user?._id) {
        socket.emit('join_user_room', user._id);
      }
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user?._id]);

  // Re-join user notification room when user changes
  useEffect(() => {
    if (socketRef.current?.connected && user?._id) {
      socketRef.current.emit('join_user_room', user._id);
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, socketRef }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}

