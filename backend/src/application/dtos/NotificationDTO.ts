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

export interface CreateNotificationInput {
  recipientId: string;
  title: string;
  message: string;
  type?: string;
}
