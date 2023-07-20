import { Request, Response } from "express";
import { UserGender } from "../entities/user";
import { JwtAuthRequest } from "../auth/jwt";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export interface WithID {
  id: string;
}

export interface WithUser {
  username: string;
  name: string;
  password: string;
}

export interface WithUser {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: UserGender;
}

//handler user
export interface IHandlerUser {
  register(req: Request, res: Response): Promise<Response>;
  login(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  logout(
    req: JwtAuthRequest<Empty, Empty, Empty, Empty>,
    res: Response
  ): Promise<Response>;
}

//handler comment
export interface IHandlerComment {}
