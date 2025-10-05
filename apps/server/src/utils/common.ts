import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { ApiError } from "./api-error";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // recommended cost factor
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const signToken = (payload: {id:number, email:string, role?: string | null | undefined}, expiresIn:  number | StringValue | undefined = "1m" ) => {
  const token = jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role ?? "user" },
    process.env.JWT_SECRET!,
    { expiresIn: expiresIn }
  );
  return token
}

export const verifyToken = (token: string) => {
  if (!token) {
    throw new ApiError(401, "Token is required");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; [key: string]: any };
    return payload;
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
};