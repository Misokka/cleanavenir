import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CleanAvenir API',
      version: '1.0.0',
      description: 'API de gestion bancaire et d\'investissement pour CleanAvenir',
      contact: {
        name: 'CleanAvenir Team',
        email: 'contact@cleanavenir.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.cleanavenir.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token (depuis Authorization header ou httpOnly cookie)',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'JWT token stocké dans un cookie httpOnly',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
            message: {
              type: 'string',
              example: 'Les données fournies sont invalides',
            },
            details: {
              type: 'object',
              additionalProperties: true,
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            firstname: {
              type: 'string',
            },
            lastname: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['client', 'advisor', 'director'],
            },
            isActive: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        BankAccount: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            accountNumber: {
              type: 'string',
            },
            accountType: {
              type: 'string',
              enum: ['checking', 'savings', 'investment'],
            },
            balance: {
              type: 'number',
              format: 'double',
            },
            currency: {
              type: 'string',
              default: 'EUR',
            },
            status: {
              type: 'string',
              enum: ['active', 'closed', 'suspended'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Operation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            accountId: {
              type: 'string',
              format: 'uuid',
            },
            type: {
              type: 'string',
              enum: ['deposit', 'withdrawal', 'transfer', 'payment'],
            },
            amount: {
              type: 'number',
              format: 'double',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    './src/interface/http-express/routes/*.ts',
    './src/interface/http-express/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
