import { httpClient } from '../httpClient';

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

export const activityService = {
  createActivity: async (input: CreateActivityInput): Promise<ActivityDTO> => {
    const response = await httpClient.post<ActivityDTO>('/activities', input);
    return response.data;
  },

  listActivities: async (limit = 50, offset = 0): Promise<ActivityDTO[]> => {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    const response = await httpClient.get<ActivityDTO[]>(`/activities?${queryParams.toString()}`);
    return response.data;
  },

  connectToActivityFeed: (onActivity: (activity: ActivityDTO) => void, onError?: (error: Error) => void): () => void => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const url = new URL(`${baseUrl}/activities/feed/stream`);
    const eventSource = new EventSource(url.toString(), {
      withCredentials: true,
    });

    eventSource.addEventListener('new_activity', (event) => {
      try {
        const activity = JSON.parse(event.data);
        onActivity(activity);
      } catch (error) {
        console.error('Error parsing activity event:', error);
        onError?.(error as Error);
      }
    });

    eventSource.addEventListener('connected', () => {
      console.log('Connected to activity feed');
    });

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onError?.(new Error('SSE connection failed'));
    };

    return () => {
      eventSource.close();
    };
  },
};
