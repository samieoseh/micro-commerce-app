import { eq } from "drizzle-orm";
import { db } from "../../db";
import { ApiError } from "../../utils/api-error";
import { users } from "../users/schema/user.schema";
import { comparePassword, hashPassword, signToken, verifyToken } from "../../utils/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from '../../db/schema';
import { PgliteDatabase } from "drizzle-orm/pglite";
import { mailerService } from "../../services/mailer.service";

class AuthService {
  constructor(private db: NodePgDatabase<schema.Schema> | PgliteDatabase<schema.Schema>) {}

  async signup({email, password, role}: {email: string, password: string, role?: string}): Promise<{ id: number, accessToken: string, refreshToken: string, role: string | null }> {
    const userExists = await this.userExists(email);

    if (userExists) {
      throw new ApiError(409, "User already exists")
    }

    const hashedPassword = await  hashPassword(password);

    const [newUser] = await this.db.insert(users).values({
      email,
      password: hashedPassword,
      role: role ?? "user"
    }).returning()

    if (!newUser) {
      throw new ApiError(500, "Failed to create user, please try again later");
    }

    const accessToken = signToken({id: newUser.id, email: newUser.email, role: newUser.role});
    const refreshToken = signToken({id: newUser.id, email: newUser.email, role: newUser.role}, '7d')


    return {id: newUser.id, accessToken, refreshToken, role: newUser.role};
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

  async login({email, password}: {email: string, password: string}): Promise<{ id: number, accessToken: string, refreshToken: string, role: string | null }> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordIsCorrect = await comparePassword(password, user.password);

    if (!passwordIsCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = signToken({id: user.id, email: user.email, role: user.role});
    const refreshToken = signToken({id: user.id, email: user.email, role: user.role}, '7d')


    return {id: user.id, accessToken, refreshToken, role: user.role};
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

    const newAccessToken = signToken({id: user.id, email: user.email, role: user.role});

    return {id: user.id, accessToken: newAccessToken, refreshToken}

  }

  async forgotPassword(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      return // so as not to expose user
    }
    const token = signToken({id: user.id, email: user.email, role: user.role}, "5m");

    const link = `${process.env.APP_URL}/verify-reset-password-token?token=${token}`;

    // send email
    if (process.env.NODE_ENV !== "test") {
      await mailerService.sendMail({
          from: "Micro-Commerce App <onboarding@resend.dev>",
          to: [user.email],
          subject: "Reset Password",
          html: `
            <p>Hello,</p>
            <p>You requested a password reset. Please click the link below:</p>
            <a href="${link}">Reset Password</a>
            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          `,
      });
    }
    

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
