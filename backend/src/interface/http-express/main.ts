import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { mainRouter } from './routes/index';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { globalRateLimiter } from './middlewares/rateLimiters';
import { requestLogger } from './middlewares/requestLogger';
import { swaggerSpec } from './swagger';


export function createServer() {
  const app = express();

  // Sécurité avec Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Rate limiting global
  app.use(globalRateLimiter);

  // CORS avec cookies
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  }));

  // Parseurs
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Logging des requêtes
  app.use(requestLogger);

  // Documentation Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'CleanAvenir API Documentation',
  }));

  app.get('/api/health', (_req, res) => {
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  app.use('/api', mainRouter);

  app.use(errorMiddleware);

  return app;
}
