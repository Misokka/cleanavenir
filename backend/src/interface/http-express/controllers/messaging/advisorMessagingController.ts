import { Request, Response } from 'express';
import { createContainer } from '../../../../infrastructure/bootstrap/container';
import { emitNewMessage, emitDiscussionClaimed, emitDiscussionTransferred, emitMessagesRead, isUserInDiscussionRoom } from '../../../../infrastructure/socket/socketServer';

const container = createContainer();

export const listAdvisorDiscussionsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await container.useCases.messaging.advisor.list.execute({ userId });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json(result.value);
  } catch (error) {
    console.error('Error listing advisor discussions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdvisorDiscussionController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id: discussionId } = req.params;

    const result = await container.useCases.messaging.advisor.get.execute({
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

export const sendAdvisorMessageController = async (req: Request, res: Response) => {
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

    const result = await container.useCases.messaging.advisor.send.execute({
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
      if (result.error.name === 'DiscussionAlreadyAssignedError') {
        return res.status(409).json({ error: result.error.message });
      }
      return res.status(400).json({ error: result.error.message });
    }

    emitNewMessage(discussionId, result.value.message);

    const discussion = await container.repositories.discussion.findById(discussionId);
    if (discussion.ok && discussion.value.clientIdentifier) {
      const client = await container.repositories.client.findById(discussion.value.clientIdentifier);
      if (client.ok) {
        const isInRoom = isUserInDiscussionRoom(client.value.userIdentifier, discussionId);
        if (!isInRoom) {
          const senderName = req.user?.firstname && req.user?.lastname
            ? `${req.user.firstname} ${req.user.lastname}`
            : 'Votre conseiller';
          
          const notifResult = await container.useCases.notification.createMessage.execute({
            senderId: userId,
            recipientId: client.value.userIdentifier,
            senderName,
            messageContent: result.value.message.content,
            discussionId,
            messageId: result.value.message.id,
          });
          
          if (notifResult.ok) {
            const { sseManager } = await import('../../../../infrastructure/sse/SSEManager');
            sseManager.sendToUser(client.value.userIdentifier, 'new_notification', notifResult.value);
          }
        }
      }
    }

    if (result.value.discussionClaimed) {
      const advisorResult = await container.repositories.advisor.findByUserId(userId);
      if (advisorResult.ok) {
        const discussionResult = await container.repositories.discussion.findById(discussionId);
        if (discussionResult.ok) {
          const discussion = discussionResult.value;
          emitDiscussionClaimed(discussionId, advisorResult.value.advisorIdentifier, {
            discussionId,
            clientId: discussion.clientIdentifier,
            advisorId: advisorResult.value.advisorIdentifier,
            status: discussion.status,
          });
        }
      }
    }

    return res.status(201).json(result.value);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const transferDiscussionController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id: discussionId } = req.params;
    const { toAdvisorId, reason } = req.body;

    if (!toAdvisorId) {
      return res.status(400).json({ error: 'Target advisor ID is required' });
    }

    const fromAdvisorResult = await container.repositories.advisor.findByUserId(userId);
    if (!fromAdvisorResult.ok) {
      return res.status(400).json({ error: 'Advisor not found' });
    }

    const result = await container.useCases.messaging.advisor.transfer.execute({
      userId,
      discussionId,
      toAdvisorId,
      reason,
    });

    if (!result.ok) {
      if (result.error.name === 'DiscussionNotFoundError') {
        return res.status(404).json({ error: result.error.message });
      }
      if (result.error.name === 'DiscussionAccessDeniedError') {
        return res.status(403).json({ error: result.error.message });
      }
      if (result.error.name === 'AdvisorNotFoundError') {
        return res.status(404).json({ error: result.error.message });
      }
      if (result.error.name === 'CannotTransferOwnDiscussionError') {
        return res.status(400).json({ error: result.error.message });
      }
      return res.status(400).json({ error: result.error.message });
    }

    emitDiscussionTransferred(
      discussionId,
      fromAdvisorResult.value.advisorIdentifier,
      toAdvisorId,
      { discussionId, toAdvisorId }
    );

    return res.status(200).json(result.value);
  } catch (error) {
    console.error('Error transferring discussion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listAdvisorsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await container.useCases.messaging.advisor.listAdvisors.execute({ userId });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json(result.value);
  } catch (error) {
    console.error('Error listing advisors:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAdvisorMessagesAsReadController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id: discussionId } = req.params;

    const result = await container.useCases.messaging.markAsRead.execute({
      discussionId,
      userId,
      userRole: 'ADVISOR',
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    emitMessagesRead(discussionId, 'ADVISOR');

    return res.json({ markedCount: result.value.markedCount });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
