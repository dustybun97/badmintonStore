//src/controllers/auth.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { pool } from "../utils/db";

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = req.body as any;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role, profile_picture_url",
    [name, email, hashedPassword]
  );

  const newUser = result.rows[0];

  // Generate JWT token
  const token = await reply.jwtSign({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  reply.send({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      profilePicture: newUser.profile_picture_url,
    },
  });
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as any;

  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = userResult.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return reply.code(401).send({ message: "Invalid credentials" });
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  console.log("Creating JWT token with payload:", tokenPayload);

  const token = await reply.jwtSign(tokenPayload);

  reply.send({ token });
};

export const getProfile = async (req: any, reply: FastifyReply) => {
  const userId = req.user.id;
  console.log("Profile request for user ID:", userId);
  console.log("Full request user object:", req.user);

  const result = await pool.query(
    "SELECT id, name, email, role, profile_picture_url FROM users WHERE id = $1",
    [userId]
  );
  const user = result.rows[0];
  console.log("Database query result:", user);

  reply.send({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profile_picture_url,
    },
  });
};

export const updateProfilePicture = async (req: any, reply: FastifyReply) => {
  const userId = req.user.id;
  const { profilePicture } = req.body as any;

  try {
    const result = await pool.query(
      "UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING id, name, email, role, profile_picture_url",
      [profilePicture, userId]
    );

    const updatedUser = result.rows[0];

    reply.send({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profile_picture_url,
      },
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    reply.code(500).send({ message: "Failed to update profile picture" });
  }
};

export const updateProfileName = async (req: any, reply: FastifyReply) => {
  const userId = req.user.id;
  const { name } = req.body as any;

  try {
    const result = await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role, profile_picture_url",
      [name, userId]
    );

    const updatedUser = result.rows[0];

    reply.send({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profile_picture_url,
      },
      message: "Profile name updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile name:", error);
    reply.code(500).send({ message: "Failed to update profile name" });
  }
};
