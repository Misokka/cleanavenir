export class GroupMessage {
  constructor(
    public readonly messageIdentifier: string,
    public readonly senderIdentifier: string,
    public readonly senderRole: 'ADVISOR' | 'DIRECTOR',
    public readonly content: string,
    public readonly createdAt: Date
  ) {}
}
