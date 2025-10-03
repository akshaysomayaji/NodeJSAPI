// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require('../../config/config');

// Check if config is not null or undefined
if (!config) {
    throw new Error('Config is not defined');
}

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
                url: `http://localhost:${config.port}`, // your server URL
            },
        ],
    },
    // Path to API docs (where you’ll add Swagger comments)
    apis: ["../routes/index.server.routes.js"],
};

try {
    const swaggerSpec = swaggerJsdoc(options);
    if (!swaggerSpec) {
        throw new Error('Failed to generate swagger spec');
    }

    function swaggerDocs(app) {
        if (!app) {
            throw new Error('App is not defined');
        }
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    module.exports = swaggerDocs;
} catch (error) {
    console.error('Error initializing swagger:', error);
    throw error;
}