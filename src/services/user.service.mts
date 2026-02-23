import argon2 from "argon2";
import userModel from "../models/user.model.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { UserSchema } from "../database/json-schema.ts";
import { generateToken, validator } from "./utils.mts";
import type { User } from "../models/types.mts";

async function login(email: string, password: string) {
  let user = null;
  let token: string | null = null;

  user = await userModel.getUserByEmail(email);

  if (!user) {
    return { user: null, token: null };
  }

  const passwordHash = user.password || user.password_hash;
  if (!passwordHash) {
    return { user: null, token: null };
  }

  const passwordMatches = await argon2.verify(passwordHash, password);

  if (!passwordMatches || !user._id) {
    return { user: null, token: null };
  }

  token = generateToken({ _id: String(user._id), email: user.email });

  return { user, token };
}

async function register(email: string, password: string, name: string) {
  const existingUser = await userModel.getUserByEmail(email);

  if (existingUser) {
    throw new EntityNotFoundError({
      message: "A user with that email already exists.",
      statusCode: 400,
      code: "ERR_VALID",
    });
  }

  const hashedPassword = await argon2.hash(password);

  const newUser: User = {
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  validator(UserSchema, newUser);

  return await userModel.createUser(newUser);
}

export default {
  login,
  register,
};
