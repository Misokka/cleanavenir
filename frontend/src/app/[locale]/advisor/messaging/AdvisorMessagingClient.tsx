'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { 
  messagingService, 
  DiscussionWithMessagesDTO, 
  DiscussionDTO, 
  AdvisorDTO 
} from '@/infrastructure/web/services/messagingService';
import { useSocket } from '@/contexts/SocketContext';

interface AdvisorMessagingClientProps {
  locale: string;
}

type TabType = 'pending' | 'assigned';

export default function AdvisorMessagingClient({ locale }: AdvisorMessagingClientProps) {
  const t = useTranslations('Messaging');
  const { socket, isConnected } = useSocket();
  
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingDiscussions, setPendingDiscussions] = useState<DiscussionDTO[]>([]);
  const [assignedDiscussions, setAssignedDiscussions] = useState<DiscussionDTO[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionWithMessagesDTO | null>(null);
  const [advisors, setAdvisors] = useState<AdvisorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [transferReason, setTransferReason] = useState('');
  const [transferring, setTransferring] = useState(false);

  const loadDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getAdvisorDiscussions();
      setPendingDiscussions(data.pending);
      setAssignedDiscussions(data.assigned);
    } catch {
      setError(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadAdvisors = useCallback(async () => {
    try {
      const data = await messagingService.getAdvisors();
      setAdvisors(data);
    } catch (err) {
      console.error('Error loading advisors:', err);
    }
  }, []);

  const loadDiscussion = useCallback(async (discussionId: string) => {
    try {
      const data = await messagingService.getAdvisorDiscussion(discussionId);
      setSelectedDiscussion(data);
    } catch (err) {
      console.error('Error loading discussion:', err);
    }
  }, []);

  useEffect(() => {
    loadDiscussions();
    loadAdvisors();
  }, [loadDiscussions, loadAdvisors]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (data: { discussionId: string }) => {
      if (selectedDiscussion?.id === data.discussionId) {
        loadDiscussion(data.discussionId);
      }
      loadDiscussions();
    };

    const handleNewDiscussion = () => {
      loadDiscussions();
    };

    const handleDiscussionClaimed = (data: { discussionId: string }) => {
      loadDiscussions();
      if (selectedDiscussion?.id === data.discussionId) {
        loadDiscussion(data.discussionId);
      }
    };

    const handleDiscussionTransferredIn = (data: { discussionId: string }) => {
      loadDiscussions();
      loadDiscussion(data.discussionId);
    };

    const handleDiscussionTransferredOut = (data: { discussionId: string }) => {
      loadDiscussions();
      if (selectedDiscussion?.id === data.discussionId) {
        setSelectedDiscussion(null);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('new_discussion', handleNewDiscussion);
    socket.on('discussion_claimed', handleDiscussionClaimed);
    socket.on('discussion_transferred_in', handleDiscussionTransferredIn);
    socket.on('discussion_transferred_out', handleDiscussionTransferredOut);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('new_discussion', handleNewDiscussion);
      socket.off('discussion_claimed', handleDiscussionClaimed);
      socket.off('discussion_transferred_in', handleDiscussionTransferredIn);
      socket.off('discussion_transferred_out', handleDiscussionTransferredOut);
    };
  }, [socket, isConnected, selectedDiscussion?.id, loadDiscussion, loadDiscussions]);

  // Join discussion room when selected
  useEffect(() => {
    if (!socket || !isConnected || !selectedDiscussion) return;

    socket.emit('join_discussion', selectedDiscussion.id);

    return () => {
      socket.emit('leave_discussion', selectedDiscussion.id);
    };
  }, [socket, isConnected, selectedDiscussion?.id, selectedDiscussion]);

  const handleSendMessage = async () => {
    if (!selectedDiscussion || !newMessage.trim() || sending) return;

    try {
      setSending(true);
      const result = await messagingService.sendAdvisorMessage(selectedDiscussion.id, newMessage.trim());
      setNewMessage('');
      
      if (result.claimed || result.discussionClaimed) {
        console.log(t('advisor.claimSuccess'));
      }
      
      await loadDiscussion(selectedDiscussion.id);
      await loadDiscussions();
    } catch (err: unknown) {
      console.error('Error sending message:', err);
      if (err instanceof Error && err.message.includes('already')) {
        setError(t('advisor.alreadyClaimed'));
        await loadDiscussions();
        setSelectedDiscussion(null);
      } else {
        setError(t('errors.sendFailed'));
      }
    } finally {
      setSending(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedDiscussion || !selectedAdvisor) return;

    try {
      setTransferring(true);
      await messagingService.transferDiscussion(selectedDiscussion.id, selectedAdvisor, transferReason);
      setShowTransferModal(false);
      setSelectedAdvisor(null);
      setTransferReason('');
      setSelectedDiscussion(null);
      await loadDiscussions();
    } catch (err) {
      console.error('Error transferring discussion:', err);
    } finally {
      setTransferring(false);
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

  const getStatusBadge = (status: string) => {
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
  };

  const currentDiscussions = activeTab === 'pending' ? pendingDiscussions : assignedDiscussions;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-4">
        {/* Left Panel - Discussions List */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Typography variant="h4" color="primary" className="mb-4">
              {t('advisor.inbox')}
            </Typography>
            
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('advisor.pendingDiscussions')}
                {pendingDiscussions.length > 0 && (
                  <span className="ml-2 bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {pendingDiscussions.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('advisor.myDiscussions')}
                {assignedDiscussions.length > 0 && (
                  <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {assignedDiscussions.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <span className="animate-pulse">Chargement...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : currentDiscussions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Typography variant="body" color="muted">
                  {activeTab === 'pending' ? t('advisor.noPending') : t('advisor.noAssigned')}
                </Typography>
              </div>
            ) : (
              <ul>
                {currentDiscussions.map((discussion) => (
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
                      <Typography variant="caption" color="muted" className="mt-1">
                        Client: {discussion.clientName || `Client #${discussion.clientId?.substring(0, 8) || 'N/A'}`}
                      </Typography>
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

        {/* Right Panel - Conversation */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          {selectedDiscussion ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h4" color="primary">
                      {selectedDiscussion.subject || 'Sans sujet'}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      Client: {selectedDiscussion.clientName || `Client #${selectedDiscussion.clientId?.substring(0, 8) || 'N/A'}`}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedDiscussion.status)}
                    {selectedDiscussion.status === 'ASSIGNED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowTransferModal(true)}
                      >
                        {t('advisor.transfer')}
                      </Button>
                    )}
                    {isConnected && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" title="Connected"></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedDiscussion.messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Typography variant="body" color="muted">
                      Aucun message. Répondez pour prendre en charge cette discussion.
                    </Typography>
                  </div>
                ) : (
                  selectedDiscussion.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderRole === 'ADVISOR' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderRole === 'ADVISOR'
                            ? 'bg-clean-dark text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <span className={`text-xs mt-1 block ${
                          message.senderRole === 'ADVISOR' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              {selectedDiscussion.status !== 'CLOSED' && (
                <div className="p-4 border-t border-gray-200">
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
                  {selectedDiscussion.status === 'PENDING' && (
                    <Typography variant="caption" color="muted" className="mt-2">
                      Répondre à ce message vous assignera comme conseiller de cette discussion.
                    </Typography>
                  )}
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
                    d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0a2.25 2.25 0 00-2.25 2.25v4.5A2.25 2.25 0 004.5 22.5h15a2.25 2.25 0 002.25-2.25v-4.5a2.25 2.25 0 00-2.25-2.25m-17.5 0V4.5A2.25 2.25 0 014.5 2.25h15A2.25 2.25 0 0121.75 4.5v9"
                  />
                </svg>
                <Typography variant="body" color="muted">
                  Sélectionnez une discussion
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <Typography variant="h4" color="primary" className="mb-4">
              {t('advisor.transferTo')}
            </Typography>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('advisor.selectAdvisor')}
              </label>
              <select
                value={selectedAdvisor || ''}
                onChange={(e) => setSelectedAdvisor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark"
              >
                <option value="">{t('advisor.selectAdvisor')}</option>
                {advisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.firstname} {advisor.lastname}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('advisor.transferReason')}
              </label>
              <textarea
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clean-dark resize-none"
                placeholder="Raison du transfert (optionnel)"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedAdvisor(null);
                  setTransferReason('');
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleTransfer}
                disabled={!selectedAdvisor || transferring}
              >
                {transferring ? '...' : t('advisor.transfer')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
