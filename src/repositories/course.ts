import { PrismaClient } from "@prisma/client";

import { ICreateCourse, ICourse } from "../entities/course";
import { IRepositoryCourse } from ".";

//export function
export function newRepositoryCourse(db: PrismaClient): IRepositoryCourse {
  return new RepositortCourse(db);
}

class RepositortCourse implements IRepositoryCourse {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createCourse(course: ICreateCourse): Promise<ICourse> {
    return await this.db.course.create({
      data: {
        courseName: course.courseName,
        videoUrl: course.videoUrl,
        duration: course.duration,
        imageUrl: course.imageUrl,
        description: course.description,
      },
    });
  }

  //get course
  async getCourses(): Promise<ICourse[]> {
    return await this.db.course.findMany({});
  }

  //waiting for connected with comments
  async getCourseById(id: number): Promise<ICourse | null> {
    return await this.db.course.findUnique({
      where: {
        id,
      },
    });
  }
}
