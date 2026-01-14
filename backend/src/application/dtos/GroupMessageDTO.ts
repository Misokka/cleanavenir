export interface GroupMessageDTO {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'ADVISOR' | 'DIRECTOR';
  content: string;
  createdAt: string;
}
