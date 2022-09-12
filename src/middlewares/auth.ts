import { User } from "@prisma/client";
import { RequestHandler } from "express";
import { JWTToUser } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const Auth: RequestHandler = async (req, res, next) => {
  let token: string | null = null;

  if ((req.signedCookies as { token: string | undefined }).token) {
    token = (req.signedCookies as { token: string }).token;
  }

  if (token !== null) {
    try {
      const user = await JWTToUser(token);
      req.user = user;
    } catch (err) {
      /* noop */
    }
  }
  next();
};

export default Auth;
