import { PrismaClient } from "@prisma/client";
import { ICreateUser, IUser } from "../entities/user";
import { ICourse } from "../entities/course";
import { ICreateComment, IComment } from "../entities/comment";

import { JwtAuthRequest } from "../auth/jwt";

export const UserDb = new PrismaClient();

export const includeUser = {
  user: {
    select: {
      id: true,
      username: true,
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
  getCourses(): Promise<ICourse[]>;
  getCourseById(id: number): Promise<ICourse | null>;
}

export interface IRepositoryComment {
  createComment(comment: ICreateComment): Promise<IComment>;
  getComments(): Promise<IComment[]>;
  getCommentById(id: number): Promise<IComment>;
  updateComment(
    where: { id: number; userId: string },
    data: { rating: number | undefined; comment: string }
  ): Promise<IComment>;
}
