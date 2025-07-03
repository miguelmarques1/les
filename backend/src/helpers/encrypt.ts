import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { authPayload } from "../dto/auth.dto";

dotenv.config();
const { JWT_SECRET = "" } = process.env;
export class encrypt {
  static encryptpass(password: string): string {
    return bcrypt.hashSync(password, 12);
  }
  
  static comparepassword(hashPassword: string, password: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload: authPayload) {
    return jwt.sign(payload, JWT_SECRET);
  }
}