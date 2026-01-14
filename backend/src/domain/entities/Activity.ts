export class Activity {
  constructor(
    public readonly activityIdentifier: string,
    public readonly authorIdentifier: string,
    public title: string,
    public content: string,
    public type: string,
    public isPublished: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  update(title: string, content: string): void {
    this.title = title;
    this.content = content;
    this.updatedAt = new Date();
  }

  publish(): void {
    this.isPublished = true;
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.isPublished = false;
    this.updatedAt = new Date();
  }
}
