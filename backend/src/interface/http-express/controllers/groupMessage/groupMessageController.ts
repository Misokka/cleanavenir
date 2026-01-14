import { Request, Response } from 'express';
import { createContainer } from '../../../../infrastructure/bootstrap/container';
import { getIO } from '../../../../infrastructure/socket/socketServer';

const container = createContainer();

export const sendGroupMessageController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (userRole !== 'ADVISOR' && userRole !== 'DIRECTOR') {
      return res.status(403).json({ error: 'Only advisors and directors can send group messages' });
    }

    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const result = await container.useCases.groupMessage.send.execute({
      userId,
      userRole,
      content: content.trim(),
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    const io = getIO();
    io.to('group_chat').emit('new_group_message', result.value);

    return res.status(201).json(result.value);
  } catch (error) {
    console.error('Error sending group message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listGroupMessagesController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (userRole !== 'ADVISOR' && userRole !== 'DIRECTOR') {
      return res.status(403).json({ error: 'Only advisors and directors can view group messages' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const result = await container.useCases.groupMessage.list.execute({ limit, offset });

    if (!result.ok) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json(result.value);
  } catch (error) {
    console.error('Error listing group messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
