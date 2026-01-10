export class DiscussionTransfer {
  constructor(
    public transferIdentifier: string,
    public discussionIdentifier: string,
    public fromAdvisorIdentifier: string,
    public toAdvisorIdentifier: string,
    public reason: string | null = null,
    public createdAt: Date = new Date(),
  ) {}

  public static create(props: {
    transferIdentifier: string,
    discussionIdentifier: string,
    fromAdvisorIdentifier: string,
    toAdvisorIdentifier: string,
    reason: string | null,
    createdAt: Date,
  }): DiscussionTransfer{
    return new DiscussionTransfer(
      props.transferIdentifier,
      props.discussionIdentifier,
      props.fromAdvisorIdentifier,
      props.toAdvisorIdentifier,
      props.reason,
      props.createdAt
    )
  }
}
