import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IRepositoryBlacklist } from "../repositories";

const secret = process.env.JWT_SECRET || "3d4p-secrets";

//create payload
export interface Payload {
  id: string;
  username: string;
}

//create newJwt
export function newJwt(payload: Payload): string {
  return jwt.sign(payload, secret, {
    algorithm: "HS512",
    expiresIn: "24h",
    issuer: "3d4p",
    subject: "user-login",
    audience: "user",
  });
}

export interface JwtAuthRequest<Params, ResBody, Reqbody, ReqQuery>
  extends Request<Params, ResBody, Reqbody, ReqQuery> {
  token: string;
  payload: Payload;
}

export class HandlerMiddleware {
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryBlacklist) {
    this.repoBlacklist = repo;
  }

  async jwtMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    try {
      if (!token) {
        return res.status(401).json({ error: "missing JWT token" }).end();
      }

      const isBlacklisted = await this.repoBlacklist.isBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({ status: `logged out` }).end();
      }

      const decoded = jwt.verify(token, secret);
      const id = decoded["id"];
      const username = decoded["username"];

      if (!id) {
        return res.status(401).json({ error: "missing payload `id" }).end();
      }

      if (!username) {
        return res
          .status(401)
          .json({ error: "missing payload `username" })
          .end();
      }

      req.token = token;
      req.payload = {
        id,
        username,
      };

      return next();
    } catch (err) {
      console.error(`Auth failed for token ${token}: ${err}`);
      return res.status(401).json({ error: "authentication failed" }).end();
    }
  }
}
