import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Token de vérification manquant',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.auth.verifyEmail.execute(token);

    if (!result.ok) {
      const error = result.error;
      
      if (error.name === 'VerificationTokenExpiredError') {
        res.status(410).json({
          error: 'TOKEN_EXPIRED',
          message: 'Le lien de vérification a expiré. Veuillez demander un nouveau lien.',
        });
        return;
      }

      if (error.name === 'VerificationTokenInvalidError') {
        res.status(400).json({
          error: 'TOKEN_INVALID',
          message: 'Le lien de vérification est invalide ou a déjà été utilisé.',
        });
        return;
      }

      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.',
      email: result.value.email,
    });
  }
);

export const resendVerificationController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Email requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.auth.resendVerificationEmail.execute(email);

    if (!result.ok) {
      console.error('Resend verification error:', result.error);
    }

    res.json({
      success: true,
      message: 'Si un compte existe avec cet email et n\'est pas encore vérifié, un nouvel email de vérification a été envoyé.',
    });
  }
);
