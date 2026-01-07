export class CannotTransferOwnDiscussionError extends Error {
  constructor() {
    super('Cannot transfer discussion to yourself');
    this.name = 'CannotTransferOwnDiscussionError';
  }
}
