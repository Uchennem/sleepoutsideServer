import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

export function authorize(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new EntityNotFoundError({
        message: "Authorization token missing or malformed.",
        statusCode: 401,
        code: "ERR_VALID",
      })
    );
  }

  const token = authHeader.substring(7).trim();
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) {
    return next(
      new EntityNotFoundError({
        message: "Authorization token missing or malformed.",
        statusCode: 401,
        code: "ERR_VALID",
      })
    );
  }

  if (!jwtSecret) {
    return next(
      new EntityNotFoundError({
        message: "JWT secret is not configured.",
        statusCode: 500,
      })
    );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as unknown;

    if (!decoded || typeof decoded !== "object") {
      throw new Error("Invalid token payload");
    }

    const payload = decoded as jwt.JwtPayload & { _id?: string; email?: string };

    if (!payload._id || !payload.email) {
      throw new Error("Invalid token payload");
    }

    res.locals.user = {
      _id: payload._id,
      email: payload.email,
    };

    next();
  } catch {
    return next(
      new EntityNotFoundError({
        message: "Invalid or expired token.",
        statusCode: 401,
        code: "ERR_VALID",
      })
    );
  }
}

export default authorize;
