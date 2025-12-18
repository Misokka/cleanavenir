import { Request, Response } from 'express';
import { toUserDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { generateToken, generateRefreshToken, setTokenCookie, setRefreshTokenCookie } from '../../../../infrastructure/adapters/JwtService';


export const registerController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Tous les champs sont requis',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Email invalide',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le mot de passe doit contenir au moins 6 caractères',
      });
      return;
    }

    const container = getContainer();
    
    const result = await container.useCases.auth.register.execute(
      firstname,
      lastname,
      email.toLowerCase(),
      password,
      password, 
      "CLIENT" // Rôle par défaut
    );

    if (!result.ok) {
      const error = result.error;
      
      if (error.message.includes("don't match") || error.message.includes('correspondent')) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: 'Les mots de passe ne correspondent pas',
        });
        return;
      }
      
      if (error.message.includes('already') || error.message.includes('utilisé')) {
        res.status(409).json({
          error: 'EMAIL_ALREADY_EXISTS',
          message: 'Un compte existe déjà avec cet email',
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

    res.status(201).json({
      token: accessToken,
      user: toUserDTO(user),
    });
  }
);
