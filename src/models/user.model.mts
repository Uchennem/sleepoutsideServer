import type { ObjectId } from "mongodb";
import mongodb from "../database/index.mts";
import type { User } from "./types.mts";

export type UserDocument = Omit<User, "_id"> & {
  _id?: ObjectId | string;
  password_hash?: string;
};

async function getUserByEmail(email: string): Promise<UserDocument | null> {
  return await mongodb.getDb().collection<UserDocument>("users").findOne({ email });
}

async function createUser(user: User): Promise<UserDocument> {
  const result = await mongodb.getDb().collection<UserDocument>("users").insertOne(user);
  return {
    ...user,
    _id: result.insertedId,
  };
}

export default {
  getUserByEmail,
  createUser,
};
