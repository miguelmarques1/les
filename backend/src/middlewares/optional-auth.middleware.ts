import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  id: number;
}

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  // Se não tiver header, só segue
  if (!header) {
    return next();
  }

  const token = header.split(" ")[1];

  // Se não tiver token no header, só segue
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Popula caso exista
    req["cus_id"] = decoded.id;
  } catch (err) {
    // Token inválido → segue sem bloquear
  }

  next();
};
