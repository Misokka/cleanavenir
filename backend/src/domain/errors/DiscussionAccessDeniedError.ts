export class DiscussionAccessDeniedError extends Error {
  constructor(discussionId: string) {
    super(`Access denied to discussion ${discussionId}`);
    this.name = 'DiscussionAccessDeniedError';
  }
}
