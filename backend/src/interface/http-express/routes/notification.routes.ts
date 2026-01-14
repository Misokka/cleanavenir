import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import {
  sendNotificationController,
  listNotificationsController,
  markNotificationAsReadController,
  notificationsSSEController,
} from '../controllers/notification/notificationController';

const router = Router();

router.use(requireAuth);
router.post('/', checkRole(['DIRECTOR']), sendNotificationController); 
router.get('/', listNotificationsController);
router.put('/:id/read', markNotificationAsReadController);
router.get('/stream', notificationsSSEController);

export { router as notificationRoutes };
