import { PrismaClient } from "@prisma/client";
import { ICreateUser, IUser } from "../entities/user";
import { ICourse } from "../entities/course";
import { ICreateComment, IComment } from "../entities/comment";
import { ICreateLesson, ILesson } from "../entities/lesson";

export const UserDb = new PrismaClient();

export const includeUser = {
  user: {
    select: {
      id: true,
      username: true,
      password: false,
      course: true,
      comment: true,
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
    data: { rating: number; comment: string }
  ): Promise<IComment>;
  deleteComment(where: { id: number; userId: string }): Promise<IComment>;
}

export interface IRepositoryLesson {
  createLesson(les: ICreateLesson): Promise<ILesson>;
  getLessons(): Promise<ILesson[]>;
  getLessonById(id: number): Promise<ILesson | null>;
  getLessonByCourseId(id: number): Promise<ILesson[]>;
}
