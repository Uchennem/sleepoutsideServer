import mongodb from "../database/index.mts";
import type { User } from './types.mts';


export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await mongodb.getDb().collection<User>("users").findOne({email: email});
    return user;
}