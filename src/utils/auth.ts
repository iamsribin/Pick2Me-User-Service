import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

export class AuthService {
  private readonly jwtSecretKey: string;

  constructor() {
    this.jwtSecretKey = process.env.USER_SECRET_KEY || "sribin";
    if (!process.env.USER_SECRET_KEY) {
      throw new Error("USER_SECRET_KEY is not defined in environment variables");
    }
  }

  createToken = async (clientId: ObjectId | string, expire: string, role: string): Promise<string> => {
    return jwt.sign({ clientId, role }, this.jwtSecretKey, {
      expiresIn: expire as SignOptions["expiresIn"],
    });
  };

  verifyOtpToken = (token: string): JwtPayload | { message: string } => {
    try {
      return jwt.verify(token, this.jwtSecretKey) as JwtPayload;
    } catch (error: any) {
      console.error("Token verification failed:", error.message);
      return { message: "Invalid OTP" };
    }
  };
}
