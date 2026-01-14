'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { groupMessageService, GroupMessageDTO } from '@/infrastructure/web/services/groupMessageService';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/features/auth/useAuth';

interface GroupChatClientProps {
  locale: string;
}

export default function GroupChatClient({ locale }: GroupChatClientProps) {
  const t = useTranslations('GroupChat');
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<GroupMessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groupMessageService.listMessages(100, 0);
      setMessages(data.reverse());
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewGroupMessage = (message: GroupMessageDTO) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('new_group_message', handleNewGroupMessage);

    return () => {
      socket.off('new_group_message', handleNewGroupMessage);
    };
  }, [socket, isConnected]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await groupMessageService.sendMessage(newMessage.trim());
      setNewMessage('');
    } catch {
      setError(t('error'));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] max-w-4xl mx-auto flex flex-col">
        <div className="bg-white rounded-t-lg shadow border border-gray-200 border-b-0 p-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" color="primary">
                {t('title')}
              </Typography>
              <Typography variant="caption" color="muted">
                {t('subtitle')}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              {isConnected && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 border-x border-gray-200 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
                ))}
              </div>
              <Typography variant="body" color="muted" className="mt-4">
                {t('loading')}
              </Typography>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Typography variant="body" color="muted">
                {error}
              </Typography>
              <Button onClick={loadMessages} className="mt-4">
                Réessayer
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              <Typography variant="body" color="muted">
                {t('noMessages')}
              </Typography>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = user?.id === message.senderId;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex items-end gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                    message.senderRole === 'DIRECTOR' 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                      : 'bg-clean-dark'
                  }`}>
                    {message.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className={`flex flex-col gap-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                      <Typography variant="body" className="font-semibold text-sm">
                        {message.senderName}
                      </Typography>
                      {message.senderRole === 'DIRECTOR' && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          {t('director')}
                        </span>
                      )}
                      {message.senderRole === 'ADVISOR' && (
                        <span className="bg-clean-dark text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          {t('advisor')}
                        </span>
                      )}
                    </div>
                    <div className={`inline-block rounded-lg p-3 shadow-sm border ${
                      isOwnMessage 
                        ? 'bg-clean-dark text-white border-clean-dark' 
                        : 'bg-white border-gray-100'
                    }`}>
                      <Typography variant="body" className={`whitespace-pre-wrap break-words ${isOwnMessage ? 'text-white' : ''}`}>
                        {message.content}
                      </Typography>
                      <Typography variant="caption" color="muted" className={`block mt-1 text-xs ${isOwnMessage ? 'text-gray-300' : 'text-gray-500'}`}>
                        {formatDate(message.createdAt)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white rounded-b-lg shadow border border-gray-200 border-t-0 p-4">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('typePlaceholder')}
              rows={2}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="self-end"
            >
              {sending ? '...' : t('send')}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
