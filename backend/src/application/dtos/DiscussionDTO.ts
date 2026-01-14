import { DiscussionStatus } from '../../domain/entities/Discussion';

export interface DiscussionDTO {
  id: string;
  clientId: string;
  advisorId: string | null;
  subject: string | null;
  status: DiscussionStatus;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  advisorName?: string;
  lastMessage?: MessageDTO;
  unreadCount?: number;
}

export interface MessageDTO {
  id: string;
  discussionId: string;
  senderId: string;
  senderRole: 'CLIENT' | 'ADVISOR';
  senderName?: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
}

export interface DiscussionTransferDTO {
  id: string;
  discussionId: string;
  fromAdvisorId: string;
  fromAdvisorName?: string;
  toAdvisorId: string;
  toAdvisorName?: string;
  reason: string | null;
  createdAt: string;
}

export interface DiscussionWithMessagesDTO {
  discussion: DiscussionDTO;
  messages: MessageDTO[];
  transfers?: DiscussionTransferDTO[];
}
