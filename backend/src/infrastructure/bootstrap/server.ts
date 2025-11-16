import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { createContainer, Container } from './container';
import { mainRouter } from '../../interface/http-express/routes/index';
import { errorMiddleware } from '../../interface/http-express/middlewares/errorMiddleware';
import { startSavingsInterestCron } from '../cron/savingsInterestCron';

function registerRoutes(app: Application, container: Container): void {
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  app.use('/api', mainRouter);

  app.use(errorMiddleware);
}

export function createServer(): { app: Application; container: Container } {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const container = createContainer();

  console.log('Container initialisé avec succès');
  console.log('   - Repositories: user, client, director, advisor, bankAccount, operation, saving');
  console.log('   - Services: passwordHasher, profileManager');
  console.log('   - Use Cases: register, login');

  registerRoutes(app, container);

  console.log('Routes enregistrées');

  return { app, container };
}

export function startServer(port: number = 3000): void {
  const { app } = createServer();

  app.listen(port, () => {
    console.log('✅ Serveur démarré avec succès');
    console.log(`   URL: http://localhost:${port}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health check: http://localhost:${port}/api/health\n`);
    
    // Démarrer le cron job pour les intérêts d'épargne
    startSavingsInterestCron();
  });
}
