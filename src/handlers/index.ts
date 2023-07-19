import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface WithId {
  id: string;
}

export interface Empty {}

export interface WithUser {
  username: string;
  password: string;
}

//handler user
export interface IHandlerUser {
  register(req, res): Promise<Response>;
  login(req, res): Promise<Response>;
  logout(req: Request, res: Response): Promise<Response>;
}

//handler comment
export interface IHandlerComment {}
