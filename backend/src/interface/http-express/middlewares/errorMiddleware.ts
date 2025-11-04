import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function errorMiddleware(
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
    return;
  }

  const errorName = err.name || err.constructor.name;

  switch (errorName) {
    case 'CompteNotFoundError':
      res.status(404).json({
        error: 'ACCOUNT_NOT_FOUND',
        message: err.message || 'Compte non trouvé',
      });
      break;

    case 'InsufficientFundsError':
      res.status(400).json({
        error: 'INSUFFICIENT_FUNDS',
        message: err.message || 'Fonds insuffisants',
      });
      break;

    case 'OperationNotFoundError':
      res.status(404).json({
        error: 'OPERATION_NOT_FOUND',
        message: err.message || 'Opération non trouvée',
      });
      break;

    case 'ValidationError':
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: err.message || 'Erreur de validation',
      });
      break;

    case 'UnauthorizedError':
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: err.message || 'Non autorisé',
      });
      break;

    case 'ForbiddenError':
      res.status(403).json({
        error: 'FORBIDDEN',
        message: err.message || 'Accès interdit',
      });
      break;

    default:
      res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message:
          process.env.NODE_ENV === 'development'
            ? err.message
            : 'Une erreur interne est survenue',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
  }
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
