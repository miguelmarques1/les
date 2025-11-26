import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { AppDataSource } from "../data-source";
import { Admin } from "../domain/entity/Admin";

dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const adminAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json({ message: "Unauthorized - Missing token" });
    return;
  }

  const token = header.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized - Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const adminRepository = AppDataSource.getRepository(Admin);
    const admin = await adminRepository.findOne({
      where: { id: decoded.id, email: decoded.email }
    });

    if (!admin) {
      res.status(403).json({ message: "Forbidden - Admin not found" });
      return;
    }

    req["admin_id"] = decoded.id;
    req["admin"] = admin;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized - Invalid token", error: err.message });
    return;
  }
};
