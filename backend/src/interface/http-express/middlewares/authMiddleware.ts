import { Request, Response, NextFunction } from 'express';
import { db } from '../../../infrastructure/drizzle/client';
import { users } from '../../../infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../infrastructure/adapters/JwtService';

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
    // 1. Vérifier dans les cookies (httpOnly - recommandé)
    let token = req.cookies?.accessToken;

    // 2. Fallback sur Authorization header (pour compatibilité)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Token manquant',
      });
      return;
    }

    // Vérifier et décoder le token
    const decoded = verifyToken(token);

    // Récupérer l'utilisateur depuis la DB
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
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
    
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'TOKEN_EXPIRED',
        message: 'Token expiré',
      });
      return;
    }

    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token invalide',
    });
  }
}
