import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const container = getContainer();
  const resetPasswordUseCase = container.useCases.auth.resetPassword;

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Email et nouveau mot de passe requis',
    });
    return;
  }

  const result = await resetPasswordUseCase.execute({ email, newPassword });

  if (!result.ok) {
    res.status(400).json({
      success: false,
      error: 'RESET_FAILED',
      message: result.error.message,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Mot de passe réinitialisé avec succès',
  });
});
