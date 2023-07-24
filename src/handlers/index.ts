import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

import { ICreateComment } from "../entities/comment";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export interface WithID {
  id: string;
}

export interface WithUser {
  username: string;
  // name: string;
  password: string;
}

export interface WithComment {
  rating: number;
  comment: string;
}

// export interface WithUser {
//   username: string;
//   password: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   gender: UserGender;
// }

//handler user
export interface IHandlerUser {
  register(req: Request, res: Response): Promise<Response>;
  login(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  logout(req: JwtAuthRequest<Empty, Empty>, res: Response): Promise<Response>;
}

//handler comment
export interface IHandlerComment {
  createComment(
    req: JwtAuthRequest<{}, ICreateComment>,
    res: Response
  ): Promise<Response>;
  getComments(req: JwtAuthRequest<{}, {}>, res: Response): Promise<Response>;
  getCommentById(
    req: JwtAuthRequest<{ id: number }, {}>,
    res: Response
  ): Promise<Response>;
  updateComment(
    req: JwtAuthRequest<WithID, WithComment>,
    res: Response
  ): Promise<Response>;
  deleteComment(
    req: JwtAuthRequest<WithID, WithComment>,
    res: Response
  ): Promise<Response>;
}

//hander course
export interface IHandlerCourse {
  getCourses(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response>;
  getCourseById(
    req: JwtAuthRequest<WithID, Empty>,
    res: Response
  ): Promise<Response>;
}

export interface IHandlerLesson {
  createLesson(req: Request, res: Response): Promise<Response>;
  getLessons(req: Request, res: Response): Promise<Response>;
  getLessonById(req: Request<{ id: number }>, res: Response): Promise<Response>;
}
