// utils/verifyToken.ts
import jwt from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";

export async function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      reply.code(401).send({ message: "Missing token" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    request.user = user;
  } catch (err) {
    reply.code(403).send({ message: "Invalid token" });
  }
}
