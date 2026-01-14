import { Request, Response } from 'express';
import { createContainer } from '../../../../infrastructure/bootstrap/container';
import { sseManager } from '../../../../infrastructure/sse/SSEManager';

const container = createContainer();

export const createActivityController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, content, type } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await container.useCases.activity.create.execute({
      userId,
      title,
      content,
      type,
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    sseManager.sendToChannel('activities', 'new_activity', result.value);

    return res.status(201).json(result.value);
  } catch (error) {
    console.error('Error creating activity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listActivitiesController = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const result = await container.useCases.activity.list.execute({ limit, offset });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json(result.value);
  } catch (error) {
    console.error('Error listing activities:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const activitiesFeedSSEController = (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  sseManager.addClient(userId, res, ['activities']);

  console.log(`SSE client connected for activities feed: user ${userId}`);
};
