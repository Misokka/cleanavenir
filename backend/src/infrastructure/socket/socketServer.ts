import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../adapters/JwtService';
import { db } from '../drizzle/client';
import { users, clients, advisors } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import * as cookie from 'cookie';

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

  io.on('connection', async (socket: AuthenticatedSocket) => {
    console.log(`user connected: ${socket.userId} (${socket.userRole})`);

    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    if (socket.clientId) {
      socket.join(`client:${socket.clientId}`);
      
      try {
        const { discussions } = await import('../drizzle/schema');
        const clientDiscussions = await db.select().from(discussions).where(eq(discussions.clientId, socket.clientId));
        clientDiscussions.forEach(discussion => {
          socket.join(`discussion:${discussion.id}`);
          console.log(`client ${socket.clientId} auto-joined discussion ${discussion.id}`);
        });
      } catch (error) {
        console.error('Error auto-joining client discussions:', error);
      }
    }

    if (socket.advisorId) {
      socket.join(`advisor:${socket.advisorId}`);
      socket.join('advisors'); // room globale pour les discussions en attente
      socket.join('group_chat'); 
      
      try {
        const { discussions } = await import('../drizzle/schema');
        const advisorDiscussions = await db.select().from(discussions).where(eq(discussions.advisorId, socket.advisorId));
        advisorDiscussions.forEach(discussion => {
          socket.join(`discussion:${discussion.id}`);
          console.log(`advisor ${socket.advisorId} auto-joined discussion ${discussion.id}`);
        });
      } catch (error) {
        console.error('Error auto-joining advisor discussions:', error);
      }
    }

    if (socket.userRole === 'DIRECTOR') {
      socket.join('group_chat');
    }

    socket.on('join_discussion', (discussionId: string) => {
      socket.join(`discussion:${discussionId}`);
      console.log(`user ${socket.userId} a rejoint la discussion ${discussionId}`);
    });

    socket.on('leave_discussion', (discussionId: string) => {
      socket.leave(`discussion:${discussionId}`);
      console.log(`user ${socket.userId} a quitté la discussion ${discussionId}`);
    });

    socket.on('typing_start', (discussionId: string) => {
      socket.to(`discussion:${discussionId}`).emit('user_typing', {
        discussionId,
        userId: socket.userId,
        userRole: socket.userRole,
      });
    });

    socket.on('typing_stop', (discussionId: string) => {
      socket.to(`discussion:${discussionId}`).emit('user_stopped_typing', {
        discussionId,
        userId: socket.userId,
        userRole: socket.userRole,
      });
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

export function emitNewMessage(discussionId: string, message: any) {
  if (io) {
    io.to(`discussion:${discussionId}`).emit('new_message', message);
    
    io.to(`discussion:${discussionId}`).emit('discussion_updated', { discussionId });
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
    io.to('advisors').emit('discussion_claimed', {
      discussionId,
      advisorId,
      discussion,
    });

    io.to(`advisor:${advisorId}`).emit('discussion_assigned', discussion);
    
    if (discussion.clientId) {
      io.to(`client:${discussion.clientId}`).emit('discussion_claimed', {
        discussionId,
        advisorId,
        discussion,
      });
    }
    
    if (io) {
      const ioInstance = io; 
      const advisorSockets = ioInstance.sockets.adapter.rooms.get(`advisor:${advisorId}`);
      if (advisorSockets) {
        advisorSockets.forEach(socketId => {
          const socket = ioInstance.sockets.sockets.get(socketId);
          if (socket) {
            socket.join(`discussion:${discussionId}`);
            console.log(`advisor ${advisorId} auto-joined discussion ${discussionId} after claiming`);
          }
        });
      }
    }
  }
}

export function emitDiscussionTransferred(
  discussionId: string,
  fromAdvisorId: string,
  toAdvisorId: string,
  discussion: any
) {
  if (io) {
    io.to(`advisor:${fromAdvisorId}`).emit('discussion_transferred_out', {
      discussionId,
      toAdvisorId,
      discussion,
    });

    io.to(`advisor:${toAdvisorId}`).emit('discussion_transferred_in', {
      discussionId,
      fromAdvisorId,
      discussion,
    });
  }
}

export function emitNewDiscussion(discussion: any) {
  if (io) {
    const ioInstance = io; 
    ioInstance.to('advisors').emit('new_discussion', discussion);
    
    if (discussion.clientId) {
      ioInstance.to(`client:${discussion.clientId}`).emit('discussion_created', discussion);
      
      const clientSockets = ioInstance.sockets.adapter.rooms.get(`client:${discussion.clientId}`);
      if (clientSockets) {
        clientSockets.forEach(socketId => {
          const socket = ioInstance.sockets.sockets.get(socketId);
          if (socket) {
            socket.join(`discussion:${discussion.id}`);
            console.log(`client ${discussion.clientId} auto-joined new discussion ${discussion.id}`);
          }
        });
      }
    }
  }
}

export function emitMessagesRead(discussionId: string, readerRole: 'CLIENT' | 'ADVISOR') {
  if (io) {
    io.to(`discussion:${discussionId}`).emit('messages_read', {
      discussionId,
      readerRole,
    });
  }
}

export function emitNewGroupMessage(message: any) {
  if (io) {
    io.to('group_chat').emit('new_group_message', message);
  }
}

export function isUserInDiscussionRoom(userId: string, discussionId: string): boolean {
  if (!io) return false;
  
  const userRoom = `user:${userId}`;
  const discussionRoom = `discussion:${discussionId}`;
  
  const userSockets = io.sockets.adapter.rooms.get(userRoom);
  if (!userSockets) return false;
  
  for (const socketId of userSockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.rooms.has(discussionRoom)) {
      return true;
    }
  }
  
  return false;
}
