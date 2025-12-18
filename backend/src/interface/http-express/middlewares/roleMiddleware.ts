import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../domain/entities/User';


export function checkRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const UserRole = req.user?.role as UserRole;

    if (!UserRole || !allowedRoles.includes(UserRole)) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Accès refusé : rôle insuffisant',
      });
      return;
    }

    next();
  };
}