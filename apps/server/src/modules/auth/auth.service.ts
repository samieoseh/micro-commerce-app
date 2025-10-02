import { eq } from "drizzle-orm";
import { db } from "../../db";
import { ApiError } from "../../utils/api-error";
import { users } from "../users/schema/user.schema";
import { comparePassword, hashPassword, signToken, verifyToken } from "../../utils/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from '../../db/schema';
import jwt from "jsonwebtoken";
import { PgliteDatabase } from "drizzle-orm/pglite";

// auth.service.ts
class AuthService {
  constructor(private db: NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema>) {}

  async signup({email, password}: {email: string, password: string}): Promise<{ id: number, accessToken: string, refreshToken: string }> {
    const userExists = await this.userExists(email);

    if (userExists) {
      throw new ApiError(409, "User already exists")
    }

    const hashedPassword = await  hashPassword(password);

    const [newUser] = await this.db.insert(users).values({
      email,
      password: hashedPassword
    }).returning()

    if (!newUser) {
      throw new ApiError(500, "Failed to create user, please try again later");
    }

    const accessToken = signToken(newUser.id, newUser.email);
    const refreshToken = signToken(newUser.id, newUser.email, '7d')


    return {id: newUser.id, accessToken, refreshToken};
  }

  async getUserByEmail(email: string) {
    const [user] =  await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async userExists(email: string): Promise<boolean> {
    const [user] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    return !!user; 
  }

  async login({email, password}: {email: string, password: string}): Promise<{ id: number, accessToken: string, refreshToken: string }> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordIsCorrect = await comparePassword(password, user.password);

    if (!passwordIsCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = signToken(user.id, user.email);
    const refreshToken = signToken(user.id, user.email, '7d')


    return {id: user.id, accessToken, refreshToken};
  }

  async refresh(refreshToken: string): Promise<{ id: number, accessToken: string, refreshToken: string }> {
    if(!refreshToken) {
      throw new ApiError(401, "Refresh token not found")
    }

    const payload = verifyToken(refreshToken)

    const user = await this.getUserByEmail(payload.email);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken = signToken(user.id, user.email);

    return {id: user.id, accessToken: newAccessToken, refreshToken}

  }

  async forgotPassword(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      return // so as not to expose user
    }
    const token = signToken(user.id, user.email, "5m");

    // send email

  }

  async resetPassword({token, newPassword}: {token: string, newPassword: string}) {
    const payload = verifyToken(token);
    const hashedPassword = await hashPassword(newPassword);

    const userUpdated  = await this.db.update(users).set({
      password: hashedPassword
    }).where(eq(users.id, payload.id)).returning();

    return userUpdated;
  }
}

const authService= new AuthService(db)
export  {authService, AuthService};
