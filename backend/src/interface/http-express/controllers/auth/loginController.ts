import { Request, Response } from 'express';
import { toUserDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { generateToken, generateRefreshToken, setTokenCookie, setRefreshTokenCookie } from '../../../../infrastructure/adapters/JwtService';

export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Email et mot de passe requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.auth.login.execute({
      email: email.toLowerCase(),
      password,
    });

    if (!result.ok) {
      const error = result.error;
      
      if (error.message.includes('credentials') || error.message.includes('email')) {
        res.status(401).json({
          error: 'INVALID_CREDENTIALS',
          message: 'Email ou mot de passe incorrect',
        });
        return;
      }

      if (error.name === 'EmailNotVerifiedError') {
        res.status(403).json({
          error: 'EMAIL_NOT_VERIFIED',
          message: 'Votre compte n\'a pas encore été activé. Consultez vos emails pour valider votre compte.',
          email: email.toLowerCase(),
        });
        return;
      }

      if (error.message.includes('désactivé') || error.message.includes('inactive') || error.message.includes('banned') || error.message.includes('banni')) {
        res.status(403).json({
          error: 'ACCOUNT_BANNED',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
      return;
    }

    const { user, profile } = result.value;

    // Générer de vrais tokens JWT et les poser en cookies httpOnly
    const accessToken = generateToken({
      userId: user.userIdentifier,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.userIdentifier,
      email: user.email,
      role: user.role,
    });

    setTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: toUserDTO(user),
      rememberMe: rememberMe || false,
    });
  }
);
