export class Notification {
  constructor(
    public readonly notificationIdentifier: string,
    public readonly senderIdentifier: string,
    public readonly recipientIdentifier: string,
    public readonly title: string,
    public readonly message: string,
    public readonly type: string,
    public isRead: boolean,
    public readonly createdAt: Date,
    public readonly discussionId?: string,
    public readonly relatedEntityId?: string
  ) {}

  markAsRead(): void {
    this.isRead = true;
  }
}
