'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/features/auth/useAuth';
import { MessageDTO, DiscussionDTO } from '../infrastructure/web/services/messagingService';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinDiscussion: (discussionId: string) => void;
  leaveDiscussion: (discussionId: string) => void;
  onNewMessage: (callback: (message: MessageDTO) => void) => () => void;
  onDiscussionUpdated: (callback: (discussion: DiscussionDTO) => void) => () => void;
  onNewDiscussion: (callback: (discussion: DiscussionDTO) => void) => () => void;
  onDiscussionCreated: (callback: (discussion: DiscussionDTO) => void) => () => void;
  onDiscussionClaimed: (callback: (data: { discussionId: string; advisorId: string }) => void) => () => void;
  onDiscussionTransferredIn: (callback: (data: { discussionId: string; fromAdvisorId: string }) => void) => () => void;
  onDiscussionTransferredOut: (callback: (data: { discussionId: string; toAdvisorId: string }) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    
    const newSocket = io(socketUrl, {
      withCredentials: true, // This sends cookies with the connection
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  const joinDiscussion = useCallback((discussionId: string) => {
    if (socket) {
      socket.emit('join_discussion', discussionId);
    }
  }, [socket]);

  const leaveDiscussion = useCallback((discussionId: string) => {
    if (socket) {
      socket.emit('leave_discussion', discussionId);
    }
  }, [socket]);

  const onNewMessage = useCallback((callback: (message: MessageDTO) => void) => {
    if (!socket) return () => {};
    socket.on('new_message', callback);
    return () => {
      socket.off('new_message', callback);
    };
  }, [socket]);

  const onDiscussionUpdated = useCallback((callback: (discussion: DiscussionDTO) => void) => {
    if (!socket) return () => {};
    socket.on('discussion_updated', callback);
    return () => {
      socket.off('discussion_updated', callback);
    };
  }, [socket]);

  const onNewDiscussion = useCallback((callback: (discussion: DiscussionDTO) => void) => {
    if (!socket) return () => {};
    socket.on('new_discussion', callback);
    return () => {
      socket.off('new_discussion', callback);
    };
  }, [socket]);

  const onDiscussionClaimed = useCallback((callback: (data: { discussionId: string; advisorId: string }) => void) => {
    if (!socket) return () => {};
    socket.on('discussion_claimed', callback);
    return () => {
      socket.off('discussion_claimed', callback);
    };
  }, [socket]);

  const onDiscussionCreated = useCallback((callback: (discussion: DiscussionDTO) => void) => {
    if (!socket) return () => {};
    socket.on('discussion_created', callback);
    return () => {
      socket.off('discussion_created', callback);
    };
  }, [socket]);

  const onDiscussionTransferredIn = useCallback((callback: (data: { discussionId: string; fromAdvisorId: string }) => void) => {
    if (!socket) return () => {};
    socket.on('discussion_transferred_in', callback);
    return () => {
      socket.off('discussion_transferred_in', callback);
    };
  }, [socket]);

  const onDiscussionTransferredOut = useCallback((callback: (data: { discussionId: string; toAdvisorId: string }) => void) => {
    if (!socket) return () => {};
    socket.on('discussion_transferred_out', callback);
    return () => {
      socket.off('discussion_transferred_out', callback);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinDiscussion,
        leaveDiscussion,
        onNewMessage,
        onDiscussionUpdated,
        onNewDiscussion,
        onDiscussionCreated,
        onDiscussionClaimed,
        onDiscussionTransferredIn,
        onDiscussionTransferredOut,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
