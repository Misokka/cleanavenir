import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../adapters/JwtService';
import { db } from '../drizzle/client';
import { users, clients, advisors } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import * as cookie from 'cookie';

/**
 * socket étendu avec les infos utilisateur
 * ces champs sont injectés après l'authentification
 */
interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  clientId?: string;
  advisorId?: string;
}

let io: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        process.env.FRONTEND_URL as string
      ].filter(Boolean),
      credentials: true,
    },
  });

  /**
   * middleware d'authentification socket
   * on essaie de récupérer le token depuis :
   * - handshake auth
   * - header authorization
   * - cookies
   */
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      let token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace('Bearer ', '');

      // si pas de token trouvé, on tente via les cookies
      if (!token && socket.handshake.headers.cookie) {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        token = cookies.accessToken;
      }

      if (!token) {
        console.log('socket auth: aucun token trouvé');
        return next(new Error('authentication required'));
      }

      const decoded = verifyToken(token);
      const userId = decoded.userId;

      // récupération de l'utilisateur en base
      const userRows = await db.select().from(users).where(eq(users.id, userId));
      if (userRows.length === 0) {
        return next(new Error('user not found'));
      }

      const user = userRows[0];
      socket.userId = user.id;
      socket.userRole = user.role;

      // récupération du profil client ou advisor selon le rôle
      if (user.role === 'CLIENT') {
        const clientRows = await db.select().from(clients).where(eq(clients.userId, user.id));
        if (clientRows.length > 0) {
          socket.clientId = clientRows[0].id;
        }
      } else if (user.role === 'ADVISOR' || user.role === 'DIRECTOR') {
        const advisorRows = await db.select().from(advisors).where(eq(advisors.userId, user.id));
        if (advisorRows.length > 0) {
          socket.advisorId = advisorRows[0].id;
        }
      }

      next();
    } catch (error) {
      console.error('socket authentication error:', error);
      next(new Error('authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`user connected: ${socket.userId} (${socket.userRole})`);

    // room personnelle par utilisateur
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // room client
    if (socket.clientId) {
      socket.join(`client:${socket.clientId}`);
    }

    // rooms advisor
    if (socket.advisorId) {
      socket.join(`advisor:${socket.advisorId}`);
      socket.join('advisors'); // room globale pour les discussions en attente
    }

    // rejoindre une discussion spécifique
    socket.on('join_discussion', (discussionId: string) => {
      socket.join(`discussion:${discussionId}`);
      console.log(`user ${socket.userId} a rejoint la discussion ${discussionId}`);
    });

    // quitter une discussion
    socket.on('leave_discussion', (discussionId: string) => {
      socket.leave(`discussion:${discussionId}`);
      console.log(`user ${socket.userId} a quitté la discussion ${discussionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.userId}`);
    });
  });

  console.log('socket.io initialisé');
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('socket.io non initialisé');
  }
  return io;
}

/**
 * helpers pour émettre les événements socket
 */

export function emitNewMessage(discussionId: string, message: any) {
  if (io) {
    io.to(`discussion:${discussionId}`).emit('new_message', message);
  }
}

export function emitDiscussionUpdate(discussionId: string, discussion: any) {
  if (io) {
    io.to(`discussion:${discussionId}`).emit('discussion_updated', discussion);
  }
}

export function emitDiscussionClaimed(
  discussionId: string,
  advisorId: string,
  discussion: any
) {
  if (io) {
    // notifier tous les advisors que la discussion n'est plus en attente
    io.to('advisors').emit('discussion_claimed', {
      discussionId,
      advisorId,
      discussion,
    });

    // notifier l'advisor qui a récupéré la discussion
    io.to(`advisor:${advisorId}`).emit('discussion_assigned', discussion);
  }
}

export function emitDiscussionTransferred(
  discussionId: string,
  fromAdvisorId: string,
  toAdvisorId: string,
  discussion: any
) {
  if (io) {
    // notifier l'ancien advisor
    io.to(`advisor:${fromAdvisorId}`).emit('discussion_transferred_out', {
      discussionId,
      toAdvisorId,
      discussion,
    });

    // notifier le nouvel advisor
    io.to(`advisor:${toAdvisorId}`).emit('discussion_transferred_in', {
      discussionId,
      fromAdvisorId,
      discussion,
    });
  }
}

export function emitNewDiscussion(discussion: any) {
  if (io) {
    // notifier tous les advisors d'une nouvelle discussion en attente
    io.to('advisors').emit('new_discussion', discussion);
  }
}
