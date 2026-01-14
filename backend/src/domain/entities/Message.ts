export type SenderRole = 'CLIENT' | 'ADVISOR';

export class Message {
  constructor(
    public messageIdentifier: string,
    public discussionIdentifier: string,
    public senderIdentifier: string,
    public senderRole: SenderRole,
    public content: string,
    public createdAt: Date = new Date(),
    public isRead: boolean = false,
    public readAt: Date | null = null,
  ) {}

  public static create(props: {
    messageIdentifier: string,
    discussionIdentifier: string,
    senderIdentifier: string,
    senderRole: SenderRole,
    content: string,
    createdAt: Date,
    isRead?: boolean,
    readAt?: Date | null,
  }): Message {
    return new Message(
      props.messageIdentifier,
      props.discussionIdentifier,
      props.senderIdentifier,
      props.senderRole,
      props.content,
      props.createdAt,
      props.isRead ?? false,
      props.readAt ?? null
    )
  }
}
