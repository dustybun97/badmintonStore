import dotenv from "dotenv";
dotenv.config();

import fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { productRoutes } from "./routes/product";
import fastifyJwt from "@fastify/jwt";
import authenticate from "./plugins/authenticate";
import authRoutes from "./routes/auth.routes";
import jwt from "@fastify/jwt";
import { verifyToken } from "./utils/verifyToken";

const server = fastify({
  logger: true,
});

// Register plugins
server.register(cors, {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
});

// Swagger documentation setup
server.register(swagger, {
  swagger: {
    info: {
      title: "Badminton Shop API",
      description: "API documentation for Badminton Shop",
      version: "1.0.0",
    },
    host: "localhost:8080",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

server.register(swaggerUi, {
  routePrefix: "/documentation",
});
server.register(productRoutes);
// Health check route
server.get("/health", async () => {
  return { status: "ok" };
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});
console.log(
  "JWT Secret configured:",
  process.env.JWT_SECRET ? "Secret exists" : "No secret found"
);
server.register(authenticate); // Register plugin

server.register(authRoutes);

// Start the server
const start = async () => {
  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
    console.log(`Server is running at http://localhost:8080`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
