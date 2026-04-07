import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS API Documentation",
      version: "1.0.0",
      description: "API docs for LMS Project",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/modules/**/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;