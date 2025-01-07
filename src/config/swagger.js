const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'hello', // 
      version: '1.0.0',
      description: 'API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your server URL
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;
