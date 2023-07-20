import { PrismaClient } from "@prisma/client";
import { ICreateUser, IUser } from "../entities/user";
import { ICourse } from "../entities/course";
import { ICreateCommentDto } from "../entities/comment";

import { JwtAuthRequest } from "../auth/jwt";

export const UserDb = new PrismaClient();

export const includeUser = {
  user: {
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      password: false,
    },
  },
};

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(username: string): Promise<IUser>;
}

export interface IRepositoryBlacklist {
  addToBlacklist(token: string): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
}

export interface IRepositoryCourse {
  getCourse(): Promise<ICourse[]>;
}

export interface IRepositoryComment {
  createComment(
    req: JwtAuthRequest<{}, {}, ICreateCommentDto, {}>,
    res: Response
  ): Promise<Response>;
  getComments(
    req: JwtAuthRequest<{}, {}, {}, {}>,
    res: Response
  ): Promise<Response>;
  getComment(
    req: JwtAuthRequest<{ id: number }, {}, {}, {}>,
    res: Response
  ): Promise<Response>;
}
