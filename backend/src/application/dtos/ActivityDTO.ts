export interface ActivityDTO {
  id: string;
  authorId: string;
  authorName?: string;
  title: string;
  content: string;
  type: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityInput {
  title: string;
  content: string;
  type?: string;
}

export interface UpdateActivityInput {
  title?: string;
  content?: string;
}
