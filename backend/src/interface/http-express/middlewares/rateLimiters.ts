import { rateLimit } from 'express-rate-limit';

/**
 * Rate Limiter global pour toutes les routes
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par fenêtre
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate Limiter strict pour l'authentification (login/register)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 tentatives de connexion
  message: {
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les échecs
});

/**
 * Rate Limiter pour les opérations sensibles (transferts, créations)
 */
export const operationsRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 opérations par minute
  message: {
    error: 'OPERATIONS_RATE_LIMIT_EXCEEDED',
    message: 'Trop d\'opérations en peu de temps. Veuillez ralentir.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
