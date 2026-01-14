import { Response } from 'express';

interface SSEClient {
  userId: string;
  response: Response;
  channels: Set<string>;
}

class SSEManager {
  private clients: Map<string, SSEClient[]> = new Map();

  addClient(userId: string, response: Response, channels: string[] = []): void {
    const client: SSEClient = {
      userId,
      response,
      channels: new Set(channels),
    };

    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }

    this.clients.get(userId)!.push(client);

    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', 
    });

    this.sendEvent(response, { type: 'connected', data: { timestamp: new Date().toISOString() } });

    response.on('close', () => {
      this.removeClient(userId, response);
    });
  }

  private removeClient(userId: string, response: Response): void {
    const userClients = this.clients.get(userId);
    if (!userClients) return;

    const index = userClients.findIndex(c => c.response === response);
    if (index !== -1) {
      userClients.splice(index, 1);
    }

    if (userClients.length === 0) {
      this.clients.delete(userId);
    }

    console.log(`SSE client disconnected: user ${userId}`);
  }

  sendToUser(userId: string, eventType: string, data: any): void {
    const userClients = this.clients.get(userId);
    if (!userClients) return;

    userClients.forEach(client => {
      this.sendEvent(client.response, { type: eventType, data });
    });
  }

  sendToChannel(channel: string, eventType: string, data: any): void {
    this.clients.forEach((userClients) => {
      userClients.forEach(client => {
        if (client.channels.has(channel)) {
          this.sendEvent(client.response, { type: eventType, data });
        }
      });
    });
  }

  broadcast(eventType: string, data: any): void {
    this.clients.forEach((userClients) => {
      userClients.forEach(client => {
        this.sendEvent(client.response, { type: eventType, data });
      });
    });
  }

  private sendEvent(response: Response, event: { type: string; data: any }): void {
    try {
      const eventData = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
      response.write(eventData);
    } catch (error) {
      console.error('Error sending SSE event:', error);
    }
  }

  getClientCount(): number {
    let count = 0;
    this.clients.forEach(userClients => {
      count += userClients.length;
    });
    return count;
  }
}

export const sseManager = new SSEManager();
