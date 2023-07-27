import { PrismaClient } from "@prisma/client";

import { ICreateUser, IUser } from "../entities/user";
import { IRepositoryUser } from ".";
import { IUserWithEnrollment } from "../entities/enrollment";

import { IEnrollment } from "../entities/enrollment";
// import { Prisma, PrismaClient } from "@prisma/client";

//export new repo function
export function newRepositoryUser(db: PrismaClient): IRepositoryUser {
  return new RepositoryUser(db);
}

//create repoUser class
class RepositoryUser implements IRepositoryUser {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  //create user
  async createUser(user: ICreateUser): Promise<IUser> {
    return await this.db.user
      .create({ data: user })
      .catch((err) =>
        Promise.reject(`failed to create user ${user.username}: ${err}`)
      );
  }

  //get user
  async getUsers(): Promise<IUser[]> {
    return await this.db.user.findMany();
  }

  async getUser(username: string): Promise<IUser> {
    return await this.db.user
      .findUnique({ where: { username } })
      .then((user) => {
        if (!user) {
          return Promise.reject(`user ${username} not found`);
        }

        return Promise.resolve(user);
      })
      .catch((err) =>
        Promise.reject(`failed to get user with condition ${username}: ${err}`)
      );
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.db.user.findUnique({ where: { id } });
  }

  async getUsersEnroll(): Promise<IUserWithEnrollment[]> {
    return await this.db.user.findMany({
      include: {
        enrollment: true,
      },
    });
  }

  async getUserEnrollById(id: string): Promise<IUserWithEnrollment | null> {
    return await this.db.user.findUnique({
      include: { enrollment: true },
      where: { id },
    });
  }

  async enroll(id: string, courseId: number): Promise<IEnrollment | null> {
    const course = await this.db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new Error("course not found");

    const user = await this.getUserEnrollById(id);
    if (!user) throw new Error("student not found");

    const enrollment = await this.db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        courseName: course.courseName,
      },
    });

    return enrollment;
  }

  async updateUser(
    id: string,
    user: { fullname?: string; lastname?: string; email?: string }
  ): Promise<IUser> {
    return await this.db.user.update({
      where: { id },
      data: user,
    });
  }
}
