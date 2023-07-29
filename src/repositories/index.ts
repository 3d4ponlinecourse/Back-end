import { PrismaClient } from "@prisma/client";
import { ICreateUser, IUser } from "../entities/user";
import { ICreateCourse, ICourse } from "../entities/course";
import { ICreateComment, IComment } from "../entities/comment";
import { ICreateLesson, ILesson } from "../entities/lesson";
import { IEnrollment, IUserWithEnrollment } from "../entities/enrollment";

export const UserDb = new PrismaClient();

export const includeUser = {
  user: {
    select: {
      id: true,
      username: true,
      password: false,
      enrollment: true,
      comment: true,
    },
  },
};

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(username: string): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getUsers(): Promise<IUser[]>;
  getUsersEnroll(): Promise<IUserWithEnrollment[]>;
  getUserEnrollById(id: string): Promise<IUserWithEnrollment | null>;
  updateUser(
    id: string,
    user: { fullname?: string; lastname?: string; email?: string }
  ): Promise<IUser>;
  enroll(id: string, courseId: number): Promise<IEnrollment | null>;
}

export interface IRepositoryBlacklist {
  addToBlacklist(token: string): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
}

export interface IRepositoryCourse {
  createCourse(course: ICreateCourse): Promise<ICourse>;
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

export interface IRepositoryEnroll {
  getUserEnroll(courseId: number): Promise<IEnrollment[]>;
  getAllEnroll(): Promise<IEnrollment[]>;
}
