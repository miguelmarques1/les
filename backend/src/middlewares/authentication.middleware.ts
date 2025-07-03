import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  userId: number;
}

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  
  if (!header) {
    res.status(401).send("Unauthorized");
    return;
  }
  
  const token = header.split(" ")[1];
  
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req['cus_id'] = decoded['id'];

    next(); 
  } catch (err) {
    res.status(401).send("Unauthorized" + err.message);
    return;
  }
};
