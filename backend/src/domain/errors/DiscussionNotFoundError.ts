export class DiscussionNotFoundError extends Error {
  constructor(discussionIdentifier: string){
    super(discussionIdentifier);
    this.name = "DiscussionNotFoundError"
  }
}