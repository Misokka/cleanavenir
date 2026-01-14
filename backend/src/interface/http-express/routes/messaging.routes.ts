import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import {
  createDiscussionController,
  listClientDiscussionsController,
  getClientDiscussionController,
  sendClientMessageController,
  markClientMessagesAsReadController,
} from '../controllers/messaging/clientMessagingController';
import {
  listAdvisorDiscussionsController,
  getAdvisorDiscussionController,
  sendAdvisorMessageController,
  transferDiscussionController,
  listAdvisorsController,
  markAdvisorMessagesAsReadController,
} from '../controllers/messaging/advisorMessagingController';

const router = Router();

router.use(requireAuth);

router.post('/discussions', checkRole(['CLIENT']), createDiscussionController);
router.get('/discussions', checkRole(['CLIENT']), listClientDiscussionsController);
router.get('/discussions/:id', checkRole(['CLIENT']), getClientDiscussionController);
router.post('/discussions/:id/messages', checkRole(['CLIENT']), sendClientMessageController);
router.post('/discussions/:id/read', checkRole(['CLIENT']), markClientMessagesAsReadController);
router.get('/advisor/discussions', checkRole(['ADVISOR', 'DIRECTOR']), listAdvisorDiscussionsController);
router.get('/advisor/discussions/:id', checkRole(['ADVISOR', 'DIRECTOR']), getAdvisorDiscussionController);
router.post('/advisor/discussions/:id/messages', checkRole(['ADVISOR', 'DIRECTOR']), sendAdvisorMessageController);
router.post('/advisor/discussions/:id/read', checkRole(['ADVISOR', 'DIRECTOR']), markAdvisorMessagesAsReadController);
router.post('/advisor/discussions/:id/transfer', checkRole(['ADVISOR', 'DIRECTOR']), transferDiscussionController);
router.get('/advisor/advisors', checkRole(['ADVISOR', 'DIRECTOR']), listAdvisorsController);

export { router as messagingRoutes };
