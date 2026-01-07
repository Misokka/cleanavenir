export class DiscussionAlreadyAssignedError extends Error {
  constructor(discussionId: string) {
    super(`Discussion ${discussionId} is already assigned to another advisor`);
    this.name = 'DiscussionAlreadyAssignedError';
  }
}
