import { PrismaClient } from "@prisma/client";
import { IRepositoryLesson } from ".";
import { ICreateLesson, ILesson } from "../entities/lesson";

//export
export function newRepositoryLesson(db: PrismaClient): IRepositoryLesson {
  return new RepositoryLesson(db);
}

class RepositoryLesson implements IRepositoryLesson {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createLesson(les: ICreateLesson): Promise<ILesson> {
    return await this.db.lesson.create({
      data: {
        ...les,
        courseId: undefined,
        course: {
          connect: { id: les.courseId },
        },
      },
    });
  }

  async getLessons(): Promise<ILesson[]> {
    return await this.db.lesson.findMany();
  }

  async getLessonById(id: number): Promise<ILesson | null> {
    return await this.db.lesson.findUnique({ where: { id } });
  }

  async getLessonByCourseId(id: number): Promise<ILesson[]> {
    return await this.db.lesson.findMany({
      where: { courseId: id },
    });
  }
}
