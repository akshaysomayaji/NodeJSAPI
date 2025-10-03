// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var config = require('../../config/config');

const options = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:"+config.port, // your server URL
      },
    ],
  },
  // Path to API docs (where you’ll add Swagger comments)
  apis: ["../routes/index.server.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;