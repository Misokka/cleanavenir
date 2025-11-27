import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../domain/value-objects/UserRole';

export function checkRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Accès refusé : rôle insuffisant',
      });
      return;
    }

    next();
  };
}