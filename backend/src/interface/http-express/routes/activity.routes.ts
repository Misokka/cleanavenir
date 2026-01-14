import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import {
  createActivityController,
  listActivitiesController,
  activitiesFeedSSEController,
} from '../controllers/activity/activityController';

const router = Router();

router.use(requireAuth);

router.post('/', checkRole(['ADVISOR', 'DIRECTOR']), createActivityController);

router.get('/', listActivitiesController);

router.get('/feed/stream', activitiesFeedSSEController);

export { router as activityRoutes };
