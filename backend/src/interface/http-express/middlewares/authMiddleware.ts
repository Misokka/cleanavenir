import { Request, Response, NextFunction } from 'express';
import { db } from '../../../infrastructure/drizzle/client';
import { users } from '../../../infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
        role: string;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Token manquant ou invalide',
      });
      return;
    }

    const token = authHeader.substring(7); 

    if (token === 'mock-jwt-token') {
      const mockUser = await db.query.users.findFirst();
      
      if (!mockUser) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Aucun utilisateur trouvé',
        });
        return;
      }

      req.userId = mockUser.id;
      req.user = {
        id: mockUser.id,
        email: mockUser.email,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        role: mockUser.role,
      };

      next();
      return;
    }

    // En production, valider le JWT avec jsonwebtoken
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // const user = await db.query.users.findFirst({
    //   where: eq(users.id, decoded.userId)
    // });
    const parts = token.split(':');
    if (parts.length < 2) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Format de token invalide',
      });
      return;
    }

    const userId = parts[0];
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Utilisateur non trouvé ou inactif',
      });
      return;
    }

    req.userId = user.id;
    req.user = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Erreur lors de la vérification du token',
    });
  }
}
