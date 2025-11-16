import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Format personnalisé pour les logs
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  // Ajouter le stack trace pour les erreurs
  if (stack) {
    msg += `\n${stack}`;
  }
  
  // Ajouter les métadonnées supplémentaires
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Déterminer le niveau de log selon l'environnement
const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Configuration du logger
const logger = winston.createLogger({
  level,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  defaultMeta: { service: 'cleanavenir-backend' },
  transports: [
    // Console (avec couleurs en développement)
    new winston.transports.Console({
      format: process.env.NODE_ENV !== 'production' 
        ? combine(colorize(), timestamp({ format: 'HH:mm:ss' }), logFormat)
        : logFormat,
    }),
    
    // Fichier pour toutes les erreurs
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Fichier pour tous les logs
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// En développement, logger également les requêtes HTTP
if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logger initialized in development mode');
}

export default logger;
