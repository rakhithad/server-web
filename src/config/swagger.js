const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path'); 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Phantasmagoria Alumni AR API',
      version: '1.0.0',
      description: 'API documentation for the University of Eastminster AR Alumni Platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
        ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-api-key',
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;