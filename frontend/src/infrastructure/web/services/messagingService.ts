import { httpClient } from '../httpClient';

export type DiscussionStatus = 'PENDING' | 'ASSIGNED' | 'CLOSED';

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
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface BackendDiscussionWithMessagesResponse {
  discussion: DiscussionDTO;
  messages: MessageDTO[];
}

export interface DiscussionWithMessagesDTO extends DiscussionDTO {
  messages: MessageDTO[];
}

export interface AdvisorDiscussionsDTO {
  pending: DiscussionDTO[];
  assigned: DiscussionDTO[];
}

export interface AdvisorDTO {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface AdvisorListItemDTO {
  advisorId: string;
  
  name: string;
  email: string;
}

export interface DiscussionTransferDTO {
  id: string;
  discussionId: string;
  fromAdvisorId: string;
  toAdvisorId: string;
  reason: string | null;
  createdAt: string;
}

export interface SendMessageResponse {
  message?: MessageDTO;
  id?: string;
  discussionId?: string;
  senderId?: string;
  senderRole?: 'CLIENT' | 'ADVISOR';
  content?: string;
  createdAt?: string;
  claimed?: boolean;
  discussionClaimed?: boolean;
}

function transformDiscussionWithMessages(response: BackendDiscussionWithMessagesResponse): DiscussionWithMessagesDTO {
  return {
    ...response.discussion,
    messages: response.messages,
  };
}

export const messagingService = {
  createDiscussion: async (subject?: string): Promise<DiscussionDTO> => {
    const response = await httpClient.post<DiscussionDTO>('/messaging/discussions', { subject });
    return response.data;
  },

  listClientDiscussions: async (): Promise<DiscussionDTO[]> => {
    const response = await httpClient.get<DiscussionDTO[]>('/messaging/discussions');
    return response.data;
  },

  getClientDiscussions: async (): Promise<DiscussionDTO[]> => {
    const response = await httpClient.get<DiscussionDTO[]>('/messaging/discussions');
    return response.data;
  },

  getClientDiscussion: async (discussionId: string): Promise<DiscussionWithMessagesDTO> => {
    const response = await httpClient.get<BackendDiscussionWithMessagesResponse>(`/messaging/discussions/${discussionId}`);
    return transformDiscussionWithMessages(response.data);
  },

  sendClientMessage: async (discussionId: string, content: string): Promise<MessageDTO> => {
    const response = await httpClient.post<MessageDTO>(`/messaging/discussions/${discussionId}/messages`, { content });
    return response.data;
  },

  listAdvisorDiscussions: async (): Promise<AdvisorDiscussionsDTO> => {
    const response = await httpClient.get<AdvisorDiscussionsDTO>('/messaging/advisor/discussions');
    return response.data;
  },

  getAdvisorDiscussions: async (): Promise<AdvisorDiscussionsDTO> => {
    const response = await httpClient.get<AdvisorDiscussionsDTO>('/messaging/advisor/discussions');
    return response.data;
  },

  getAdvisorDiscussion: async (discussionId: string): Promise<DiscussionWithMessagesDTO> => {
    const response = await httpClient.get<BackendDiscussionWithMessagesResponse>(`/messaging/advisor/discussions/${discussionId}`);
    return transformDiscussionWithMessages(response.data);
  },

  sendAdvisorMessage: async (discussionId: string, content: string): Promise<SendMessageResponse> => {
    const response = await httpClient.post<SendMessageResponse>(`/messaging/advisor/discussions/${discussionId}/messages`, { content });
    return response.data;
  },

  transferDiscussion: async (discussionId: string, toAdvisorId: string, reason?: string): Promise<DiscussionTransferDTO> => {
    const response = await httpClient.post<DiscussionTransferDTO>(`/messaging/advisor/discussions/${discussionId}/transfer`, {
      toAdvisorId,
      reason,
    });
    return response.data;
  },

  listAdvisors: async (): Promise<AdvisorDTO[]> => {
    const response = await httpClient.get<AdvisorDTO[]>('/messaging/advisor/advisors');
    return response.data;
  },

  getAdvisors: async (): Promise<AdvisorDTO[]> => {
    const response = await httpClient.get<AdvisorDTO[]>('/messaging/advisor/advisors');
    return response.data;
  },

  markClientMessagesAsRead: async (discussionId: string): Promise<{ markedCount: number }> => {
    const response = await httpClient.post<{ markedCount: number }>(`/messaging/discussions/${discussionId}/read`);
    return response.data;
  },

  markAdvisorMessagesAsRead: async (discussionId: string): Promise<{ markedCount: number }> => {
    const response = await httpClient.post<{ markedCount: number }>(`/messaging/advisor/discussions/${discussionId}/read`);
    return response.data;
  },
};
