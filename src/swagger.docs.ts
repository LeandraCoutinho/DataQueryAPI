export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'DataQuery API',
    version: '1.0.0',
    description: 'DataQuery Project API Documentation.',
    contact: {
      name: 'Leandra Coutinho',
      email: 'leandracou123@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Document Ingestion and Management API',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Adicione apenas o token JWT abaixo, sem o prefixo "Bearer". Ex: eyJhbGciOiJIUzI1NiIsInR5cCI6...'
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created successfully' },
          400: { description: 'Email is already in use' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticates a user and returns a JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authentication successful' },
          401: { description: 'Invalid credentials' },
          404: { description: 'User does not exists'}
        },
      },
    },
    '/datasets/upload': {
      post: {
        summary: 'Upload a file (CSV or PDF)',
        tags: ['Datasets'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          201: { description: 'File sent successfully' },
          400: { description: 'File format not supported' },
        },
      },
    },
    '/datasets': {
      get: {
        summary: 'List authenticated user datasets',
        tags: ['Datasets'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of datasets returned successfully'},
          404: { description: 'User does not have a registered dataset'}
        },
      },
    },
    '/datasets/{datasetId}/records': {
      get: {
        summary: 'List records from a specific dataset',
        tags: ['Datasets'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'datasetId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Records returned successfully'},
          403: { description: 'User does not have access to this dataset'},
          404: { description: 'Dataset not found or not owned by user'}
        },
      },
    },
    '/queries': {
      post: {
        tags: ['Queries'],
        summary: 'Submit a question',
        description: 'Allows the user to submit a new question related to a dataset.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  datasetId: {
                    type: 'string',
                    example: 'abc123',
                  },
                  question: {
                    type: 'string',
                    example: 'What is the average age of your customers?',
                  },
                },
                required: ['datasetId', 'question'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Question answer generated successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    answer: {
                      type: 'string',
                      example: 'The average age is 35 years.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized. Missing or invalid JWT token.'
          },
          404: {
            description: 'Dataset not found'
          }
        },
        security: [{ bearerAuth: [] }],
      },
      get: {
        tags: ['Queries'],
        summary: 'List user questions',
        description: 'Returns a list of all questions asked by the authenticated user.',
        responses: {
          200: {
            description: 'Question list returned successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'query123' },
                      question: { type: 'string', example: 'How many records are there?' },
                      createdAt: { type: 'string', format: 'date-time', example: '2025-07-21T14:55:00Z' },
                      datasetId: { type: 'string', example: 'abc123' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized. Missing or invalid JWT token.'
          },
          404: {
            description: 'User has no queries'
          }
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/records/search': {
    get: {
        tags: ['Records'],
        summary: 'Search records by keyword',
        description: 'Searches for records in the dataset based on a keyword entered by the user.',
        parameters: [
        {
            name: 'query',
            in: 'query',
            required: true,
            schema: {
            type: 'string',
            example: 'active customers'
            },
            description: 'Search term'
        }
        ],
        responses: {
        200: {
            description: 'List of records found.',
            content: {
            'application/json': {
                schema: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                    id: { type: 'string', example: 'rec123' },
                    content: { type: 'string', example: 'Record of active customers in 2024' },
                    datasetId: { type: 'string', example: 'abc123' },
                    },
                },
                },
            },
            },
        },
        400: {
            description: 'keyword is required.'
        },
        401: {
            description: 'Unauthorized. Missing or invalid JWT token.'
        }
        },
        security: [{ bearerAuth: [] }],
        }
    },
    '/me': {
      get: {
        tags: ['Users'],
        summary: 'Returns the authenticated users data',
        description: 'Requires authentication via JWT token.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User data returned successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'user-123' },
                    name: { type: 'string', example: 'Leandra Coutinho' },
                    email: { type: 'string', example: 'leandracou123@gmail.com' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized. Invalid or missing token.',
          },
          404: {
            description: 'User not found in database.'
          }
        },
      },
    },
  },
};
