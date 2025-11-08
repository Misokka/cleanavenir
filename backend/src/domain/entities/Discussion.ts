export class Discussion {
  constructor(
    public discussionIdentifier: string,
    public clientIdentifier: string,
    public advisorIdentifier?: string,
    public subject?: string,
    public createdAt: Date = new Date(),
  ) {}
}
