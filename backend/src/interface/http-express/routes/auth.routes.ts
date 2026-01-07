import { Router } from 'express';
import { 
  loginController, 
  registerController, 
  meController, 
  logoutController,
  refreshTokenController,
  resetPasswordController
} from '../controllers/auth';
import { 
  verifyEmailController, 
  resendVerificationController 
} from '../controllers/auth/emailVerificationController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/refresh', refreshTokenController);
router.post('/reset-password', resetPasswordController);

// Email verification routes
router.get('/verify-email', verifyEmailController);
router.post('/resend-verification', resendVerificationController);

router.get('/me', requireAuth, meController);
router.post('/logout', requireAuth, logoutController);

export const authRoutes = router;
