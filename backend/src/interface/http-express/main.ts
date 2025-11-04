import express from 'express';
import cors from 'cors';
import { mainRouter } from './routes/index';
import { errorMiddleware } from './middlewares/errorMiddleware';


export function createServer() {
  const app = express();

  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
