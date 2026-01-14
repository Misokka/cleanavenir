import { Request, Response } from 'express';
import { createContainer } from '../../../../infrastructure/bootstrap/container';
import { emitNewMessage, emitNewDiscussion, emitMessagesRead, isUserInDiscussionRoom } from '../../../../infrastructure/socket/socketServer';

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

    const discussion = await container.repositories.discussion.findById(discussionId);
    if (discussion.ok) {
      if (discussion.value.advisorIdentifier) {
        const advisor = await container.repositories.advisor.findById(discussion.value.advisorIdentifier);
        if (advisor.ok) {
          const isInRoom = isUserInDiscussionRoom(advisor.value.userIdentifier, discussionId);
          if (!isInRoom) {
            const senderName = req.user?.firstname && req.user?.lastname 
              ? `${req.user.firstname} ${req.user.lastname}`
              : 'Un client';
            
            const notifResult = await container.useCases.notification.createMessage.execute({
              senderId: userId,
              recipientId: advisor.value.userIdentifier,
              senderName,
              messageContent: result.value.content,
              discussionId,
              messageId: result.value.id,
            });
            
            if (notifResult.ok) {
              const { sseManager } = await import('../../../../infrastructure/sse/SSEManager');
              sseManager.sendToUser(advisor.value.userIdentifier, 'new_notification', notifResult.value);
            }
          }
        }
      }
    }

    return res.status(201).json(result.value);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const markClientMessagesAsReadController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id: discussionId } = req.params;

    const result = await container.useCases.messaging.markAsRead.execute({
      discussionId,
      userId,
      userRole: 'CLIENT',
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    emitMessagesRead(discussionId, 'CLIENT');

    return res.json({ markedCount: result.value.markedCount });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
