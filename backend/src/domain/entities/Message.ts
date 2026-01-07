export type SenderRole = 'CLIENT' | 'ADVISOR';

export class Message {
  constructor(
    public messageIdentifier: string,
    public discussionIdentifier: string,
    public senderIdentifier: string,
    public senderRole: SenderRole,
    public content: string,
    public createdAt: Date = new Date(),
  ) {}
}
