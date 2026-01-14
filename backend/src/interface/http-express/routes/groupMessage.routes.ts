import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import {
  sendGroupMessageController,
  listGroupMessagesController,
} from '../controllers/groupMessage/groupMessageController';

const router = Router();

router.use(requireAuth);
router.use(checkRole(['ADVISOR', 'DIRECTOR']));

router.post('/', sendGroupMessageController);

router.get('/', listGroupMessagesController);

export { router as groupMessageRoutes };
