import { Request, Response, NextFunction } from 'express';
import { normalizePaginationOptions, PaginationOptions, PAGINATION_DEFAULTS } from '../../../shared/pagination';

/**
 * Middleware pour parser et valider les paramètres de pagination depuis la query string
 */
export function paginationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    // Valider que les nombres sont valides
    if (page !== undefined && (isNaN(page) || page < 1)) {
      res.status(400).json({
        error: 'INVALID_PAGINATION',
        message: 'Le paramètre "page" doit être un nombre positif',
      });
      return;
    }

    if (limit !== undefined && (isNaN(limit) || limit < 1)) {
      res.status(400).json({
        error: 'INVALID_PAGINATION',
        message: 'Le paramètre "limit" doit être un nombre positif',
      });
      return;
    }

    if (limit !== undefined && limit > PAGINATION_DEFAULTS.MAX_LIMIT) {
      res.status(400).json({
        error: 'INVALID_PAGINATION',
        message: `Le paramètre "limit" ne peut pas dépasser ${PAGINATION_DEFAULTS.MAX_LIMIT}`,
      });
      return;
    }

    // Normaliser et attacher à la requête
    const paginationOptions: PaginationOptions = { page, limit };
    req.pagination = normalizePaginationOptions(paginationOptions);

    next();
  } catch (error) {
    res.status(400).json({
      error: 'INVALID_PAGINATION',
      message: 'Paramètres de pagination invalides',
    });
  }
}

// Étendre le type Request pour inclure la pagination
declare global {
  namespace Express {
    interface Request {
      pagination?: Required<PaginationOptions>;
    }
  }
}
