// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Donation & Fundraising API",
      version: "1.0.0",
      description: "API documentation for Online Donation & Fundraising Portal",
    },
    servers: [
      { url: "http://localhost:8000" },
      { url: "https://donation-website-ebe7.onrender.com" } 
    ],
  },
  apis: ["./app/routes/*.js"], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
