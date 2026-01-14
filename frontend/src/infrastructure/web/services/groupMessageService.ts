import { httpClient } from '../httpClient';

export interface GroupMessageDTO {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'ADVISOR' | 'DIRECTOR';
  content: string;
  createdAt: string;
}

export const groupMessageService = {
  sendMessage: async (content: string): Promise<GroupMessageDTO> => {
    const response = await httpClient.post<GroupMessageDTO>('/group-messages', { content });
    return response.data;
  },

  listMessages: async (limit = 100, offset = 0): Promise<GroupMessageDTO[]> => {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    const response = await httpClient.get<GroupMessageDTO[]>(`/group-messages?${queryParams.toString()}`);
    return response.data;
  },
};
