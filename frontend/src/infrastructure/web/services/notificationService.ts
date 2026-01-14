import { httpClient } from '../httpClient';

export interface NotificationDTO {
  id: string;
  senderId: string;
  senderName?: string;
  recipientId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  discussionId?: string;
  relatedEntityId?: string;
}

export interface SendNotificationInput {
  recipientUserId: string;
  title: string;
  message: string;
  type?: string;
}

export const notificationService = {
  sendNotification: async (input: SendNotificationInput): Promise<NotificationDTO> => {
    const response = await httpClient.post<NotificationDTO>('/notifications', input);
    return response.data;
  },

  listNotifications: async (limit = 50, offset = 0): Promise<NotificationDTO[]> => {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    const response = await httpClient.get<NotificationDTO[]>(`/notifications?${queryParams.toString()}`);
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await httpClient.put(`/notifications/${notificationId}/read`);
  },

  connectToNotifications: (
    onNotification: (notification: NotificationDTO) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const url = new URL(`${baseUrl}/notifications/stream`);
    const eventSource = new EventSource(url.toString(), {
      withCredentials: true,
    });

    eventSource.addEventListener('new_notification', (event) => {
      try {
        const notification = JSON.parse(event.data);
        onNotification(notification);
      } catch (error) {
        console.error('Error parsing notification event:', error);
        onError?.(error as Error);
      }
    });

    eventSource.addEventListener('connected', () => {
      console.log('Connected to notifications stream');
    });

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onError?.(new Error('SSE connection failed'));
    };

    return () => {
      eventSource.close();
    };
  },
};
