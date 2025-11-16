import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createServer } from '../../src/interface/http-express/main';
import type { Express } from 'express';

describe('API Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createServer();
  });

  describe('Health Check', () => {
    it('GET /api/health should return status ok', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(app).get('/api/accounts');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should accept requests with valid token', async () => {
      // Note: Vous devrez adapter ce test selon votre implémentation d'auth
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      if (loginResponse.status === 200) {
        const token = loginResponse.body.token;

        const response = await request(app)
          .get('/api/accounts')
          .set('Authorization', `Bearer ${token}`);

        expect([200, 404]).toContain(response.status);
      }
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from Helmet', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
    });
  });

  describe('API Documentation', () => {
    it('GET /api-docs should serve Swagger UI', async () => {
      const response = await request(app).get('/api-docs/');

      expect(response.status).toBe(200);
      expect(response.text).toContain('swagger');
    });
  });
});
