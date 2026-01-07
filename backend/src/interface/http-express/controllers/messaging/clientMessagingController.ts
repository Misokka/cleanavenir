import { Request, Response } from 'express';
import { createContainer } from '../../../../infrastructure/bootstrap/container';
import { emitNewMessage, emitNewDiscussion } from '../../../../infrastructure/socket/socketServer';

const container = createContainer();

export const createDiscussionController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { subject } = req.body;

    const result = await container.useCases.messaging.client.create.execute({
      userId,
      subject,
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    emitNewDiscussion(result.value);

    return res.status(201).json(result.value);
  } catch (error) {
    console.error('Error creating discussion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listClientDiscussionsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await container.useCases.messaging.client.list.execute({ userId });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json(result.value);
  } catch (error) {
    console.error('Error listing discussions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClientDiscussionController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id: discussionId } = req.params;

    const result = await container.useCases.messaging.client.get.execute({
      userId,
      discussionId,
    });

    if (!result.ok) {
      if (result.error.name === 'DiscussionNotFoundError') {
        return res.status(404).json({ error: result.error.message });
      }
      if (result.error.name === 'DiscussionAccessDeniedError') {
        return res.status(403).json({ error: result.error.message });
      }
      return res.status(400).json({ error: result.error.message });
    }

    return res.json(result.value);
  } catch (error) {
    console.error('Error getting discussion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendClientMessageController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id: discussionId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const result = await container.useCases.messaging.client.send.execute({
      userId,
      discussionId,
      content: content.trim(),
    });

    if (!result.ok) {
      if (result.error.name === 'DiscussionNotFoundError') {
        return res.status(404).json({ error: result.error.message });
      }
      if (result.error.name === 'DiscussionAccessDeniedError') {
        return res.status(403).json({ error: result.error.message });
      }
      return res.status(400).json({ error: result.error.message });
    }

    emitNewMessage(discussionId, result.value);

    return res.status(201).json(result.value);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
