import { Request, Response, NextFunction } from 'express';
import logger from '../../../infrastructure/adapters/logger';

/**
 * Middleware de logging des requêtes HTTP
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Logger la requête entrante
  logger.info(`Incoming request`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capturer la fin de la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

    logger.log(logLevel, `Request completed`, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.userId,
    });
  });

  next();
}
