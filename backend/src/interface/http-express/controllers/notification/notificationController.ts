import { Request, Response } from 'express';
import { createContainer } from '../../../../infrastructure/bootstrap/container';
import { sseManager } from '../../../../infrastructure/sse/SSEManager';

const container = createContainer();

export const sendNotificationController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { recipientUserId, title, message, type } = req.body;

    if (!recipientUserId || !title || !message) {
      return res.status(400).json({ error: 'recipientUserId, title, and message are required' });
    }

    const result = await container.useCases.notification.send.execute({
      userId,
      recipientUserId,
      title,
      message,
      type,
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    sseManager.sendToUser(recipientUserId, 'new_notification', result.value);

    return res.status(201).json(result.value);
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listNotificationsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const result = await container.useCases.notification.list.execute({
      userId,
      limit,
      offset,
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json(result.value);
  } catch (error) {
    console.error('Error listing notifications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const markNotificationAsReadController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    const result = await container.useCases.notification.markAsRead.execute({
      userId,
      notificationId: id,
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const notificationsSSEController = (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  sseManager.addClient(userId, res, []);

  console.log(`SSE client connected for notifications: user ${userId}`);
};
