'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import {
  messagingService,
  DiscussionDTO,
  DiscussionWithMessagesDTO,
} from '@/infrastructure/web/services/messagingService';
import { useSocket } from '@/contexts/SocketContext';

interface MessagingClientProps {
  locale: string;
}

export default function MessagingClient({ locale }: MessagingClientProps) {
  const t = useTranslations('Messaging');
  const { socket, isConnected } = useSocket();

  const [discussions, setDiscussions] = useState<DiscussionDTO[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionWithMessagesDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [creating, setCreating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedDiscussionIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedDiscussionIdRef.current = selectedDiscussion?.id ?? null;
  }, [selectedDiscussion?.id]);

  const formatDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    },
    [locale]
  );

  const getStatusBadge = useCallback(
    (status: string) => {
      const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ASSIGNED: 'bg-blue-100 text-blue-800',
        CLOSED: 'bg-gray-100 text-gray-800',
      };

      const labels: Record<string, string> = {
        PENDING: t('pending'),
        ASSIGNED: t('assigned'),
        CLOSED: t('closed'),
      };

      return (
        <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || colors.PENDING}`}>
          {labels[status] || status}
        </span>
      );
    },
    [t]
  );

  const loadDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getClientDiscussions();
      setDiscussions(data);
    } catch {
      setError(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadDiscussion = useCallback(async (discussionId: string) => {
    try {
      const data = await messagingService.getClientDiscussion(discussionId);
      setSelectedDiscussion(data);
    } catch (err) {
      console.error('error loading discussion:', err);
    }
  }, []);

  useEffect(() => {
    loadDiscussions();
  }, [loadDiscussions]);

  const uniqueMessages = useMemo(() => {
    if (!selectedDiscussion) return [];
    const seen = new Set<string>();
    return selectedDiscussion.messages.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [selectedDiscussion]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: any) => {
      const discussionId = message.discussionId || message.id;

      if (selectedDiscussionIdRef.current === discussionId) {
        setSelectedDiscussion((prev) => {
          if (!prev) return prev;

          const exists = prev.messages.some((m) => m.id === message.id);
          if (exists) return prev;

          return {
            ...prev,
            messages: [...prev.messages, message],
          };
        });
      }

      loadDiscussions();
    };

    const handleDiscussionClaimed = (data: { discussionId: string }) => {
      loadDiscussions();
      if (selectedDiscussionIdRef.current === data.discussionId) {
        loadDiscussion(data.discussionId);
      }
    };

    const handleDiscussionUpdated = (data: { discussionId: string }) => {
      loadDiscussions();
      if (selectedDiscussionIdRef.current === data.discussionId) {
        loadDiscussion(data.discussionId);
      }
    };

    const handleDiscussionCreated = () => {
      loadDiscussions();
    };

    const handleUserTyping = (data: { discussionId: string; userRole: string }) => {
      if (selectedDiscussionIdRef.current === data.discussionId && data.userRole === 'ADVISOR') {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (data: { discussionId: string; userRole: string }) => {
      if (selectedDiscussionIdRef.current === data.discussionId && data.userRole === 'ADVISOR') {
        setIsTyping(false);
      }
    };

    const handleMessagesRead = (data: { discussionId: string; readerRole: string }) => {
      if (selectedDiscussionIdRef.current === data.discussionId && data.readerRole === 'ADVISOR') {
        setSelectedDiscussion((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map((msg) => {
              if (msg.senderRole === 'CLIENT') {
                return { ...msg, isRead: true, readAt: new Date().toISOString() };
              }
              return msg;
            }),
          };
        });
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('discussion_claimed', handleDiscussionClaimed);
    socket.on('discussion_updated', handleDiscussionUpdated);
    socket.on('discussion_created', handleDiscussionCreated);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('discussion_claimed', handleDiscussionClaimed);
      socket.off('discussion_updated', handleDiscussionUpdated);
      socket.off('discussion_created', handleDiscussionCreated);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, isConnected, loadDiscussions, loadDiscussion]);

  useEffect(() => {
    if (!socket || !isConnected || !selectedDiscussion?.id) return;

    socket.emit('join_discussion', selectedDiscussion.id);

    messagingService.markClientMessagesAsRead(selectedDiscussion.id).catch(console.error);

    return () => {
      socket.emit('leave_discussion', selectedDiscussion.id);
    };
  }, [socket, isConnected, selectedDiscussion?.id]);

  const stopTyping = useCallback(() => {
    if (!socket || !isConnected || !selectedDiscussion?.id) return;

    socket.emit('typing_stop', selectedDiscussion.id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [socket, isConnected, selectedDiscussion?.id]);

  const handleSendMessage = useCallback(async () => {
    if (!selectedDiscussion || !newMessage.trim() || sending) return;

    stopTyping();

    try {
      setSending(true);

      await messagingService.sendClientMessage(selectedDiscussion.id, newMessage.trim());
      setNewMessage('');

      loadDiscussions();
    } catch {
      setError(t('errors.sendFailed'));
    } finally {
      setSending(false);
    }
  }, [selectedDiscussion, newMessage, sending, stopTyping, loadDiscussions, t]);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value);

      if (!socket || !isConnected || !selectedDiscussion?.id) return;

      socket.emit('typing_start', selectedDiscussion.id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', selectedDiscussion.id);
      }, 2000);
    },
    [socket, isConnected, selectedDiscussion?.id]
  );

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleCreateDiscussion = useCallback(async () => {
    if (!newSubject.trim() || creating) return;

    try {
      setCreating(true);
      const created = await messagingService.createDiscussion(newSubject.trim());
      setShowNewDiscussion(false);
      setNewSubject('');
      setDiscussions((prev) => [created, ...prev]);
      await loadDiscussion(created.id);
      if (socket && isConnected) {
        socket.emit('join_discussion', created.id);
      }
      loadDiscussions();
    } catch {
      setError(t('errors.createFailed'));
    } finally {
      setCreating(false);
    }
  }, [newSubject, creating, loadDiscussion, socket, isConnected, loadDiscussions, t]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-4">
        {/* liste discussions */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Typography variant="h4" color="primary">
              {t('myDiscussions')}
            </Typography>
            <Button size="sm" onClick={() => setShowNewDiscussion(true)}>
              {t('newDiscussion')}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <span className="animate-pulse">Chargement...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : discussions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Typography variant="body" color="muted">
                  {t('noDiscussions')}
                </Typography>
              </div>
            ) : (
              <ul>
                {discussions.map((discussion) => (
                  <li key={discussion.id}>
                    <button
                      onClick={() => loadDiscussion(discussion.id)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        selectedDiscussion?.id === discussion.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <Typography variant="body" className="font-medium truncate">
                          {discussion.subject || 'Sans sujet'}
                        </Typography>
                        {getStatusBadge(discussion.status)}
                      </div>

                      {discussion.advisorName && (
                        <Typography variant="caption" color="muted" className="mt-1">
                          Conseiller: {discussion.advisorName}
                        </Typography>
                      )}

                      <Typography variant="caption" color="muted" className="block mt-1">
                        {formatDate(discussion.createdAt)}
                      </Typography>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* discussion */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          {selectedDiscussion ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h4" color="primary">
                      {selectedDiscussion.subject || 'Sans sujet'}
                    </Typography>
                    {selectedDiscussion.advisorName && (
                      <Typography variant="caption" color="muted">
                        Conseiller: {selectedDiscussion.advisorName}
                      </Typography>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedDiscussion.status)}
                    {isConnected && <span className="w-2 h-2 bg-green-500 rounded-full" title="connected" />}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {uniqueMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Typography variant="body" color="muted">
                      {t('noMessages')}
                    </Typography>
                  </div>
                ) : (
                  uniqueMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderRole === 'CLIENT' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderRole === 'CLIENT' ? 'bg-clean-dark text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.senderRole === 'ADVISOR' && message.senderName && (
                          <span className="text-xs font-medium text-clean-dark block mb-1">{message.senderName}</span>
                        )}
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            message.senderRole === 'CLIENT' ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          <span className="text-xs">{formatDate(message.createdAt)}</span>

                          {message.senderRole === 'CLIENT' && (
                            <span title={message.isRead ? t('read') : t('sent')}>
                              {message.isRead ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4 text-blue-400"
                                >
                                  <path d="M1.5 12.5l5 5L18 6l-1.5-1.5L7 14l-3.5-3.5L1.5 12.5zM8 17l-5-5 1.5-1.5L8 14l8.5-8.5L18 7 8 17z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedDiscussion.status !== 'CLOSED' && (
                <div className="p-4 border-t border-gray-200">
                  {isTyping && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </span>
                      <span>{t('typing')}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={handleMessageChange}
                      onKeyDown={handleKeyPress}
                      placeholder={t('typePlaceholder')}
                      rows={2}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark resize-none"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="self-end">
                      {sending ? '...' : t('send')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
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
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
                <Typography variant="body" color="muted">
                  {t('selectDiscussion')}
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewDiscussion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <Typography variant="h4" color="primary" className="mb-4">
              {t('newDiscussion')}
            </Typography>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('subject')}</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark"
                placeholder={t('subjectPlaceholder')}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewDiscussion(false);
                  setNewSubject('');
                }}
              >
                {t('cancel')}
              </Button>
              <Button onClick={handleCreateDiscussion} disabled={!newSubject.trim() || creating}>
                {creating ? '...' : t('create')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
