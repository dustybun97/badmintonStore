// src/routes/auth.routes.ts
import { FastifyInstance } from "fastify";
import {
  register,
  login,
  getProfile,
  updateProfilePicture,
  updateProfileName,
} from "../controllers/auth.controller";

export default async function (fastify: FastifyInstance) {
  fastify.post("/api/register", register);
  fastify.post("/api/login", login);
  fastify.get(
    "/api/profile",
    { preHandler: [fastify.authenticate] },
    getProfile
  ); // ✅ warning หายไปหลัง type ถูกต้อง
  fastify.put(
    "/api/profile/picture",
    { preHandler: [fastify.authenticate] },
    updateProfilePicture
  );
  fastify.put(
    "/api/profile/name",
    { preHandler: [fastify.authenticate] },
    updateProfileName
  );
}
