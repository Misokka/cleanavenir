import { Request, Response } from 'express';
import { db } from '../../../../infrastructure/drizzle/client';
import { users } from '../../../../infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';
import { toUserDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';

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

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Email ou mot de passe incorrect',
      });
      return;
    }

    // TODO: En production, utiliser bcrypt.compare(password, user.password)
    // Pour le dev, comparaison directe (mot de passe en clair)
    if (password !== user.password) {
      res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Email ou mot de passe incorrect',
      });
      return;
    }

    // Vérifier que l'utilisateur est actif
    if (!user.isActive) {
      res.status(403).json({
        error: 'ACCOUNT_INACTIVE',
        message: 'Compte désactivé',
      });
      return;
    }

    // TODO: En production, générer un vrai JWT avec jsonwebtoken
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email, role: user.role },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: rememberMe ? '30d' : '7d' }
    // );

    // Pour le dev, token simple (format: userId:email)
    const token = `${user.id}:${user.email}`;

    res.json({
      token,
      user: toUserDTO(user),
      rememberMe: rememberMe || false,
    });
  }
);
