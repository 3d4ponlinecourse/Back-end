import { PrismaClient } from "@prisma/client";
import { IEnrollment } from "../entities/enrollment";
import { IRepositoryEnroll } from ".";

//export
export function newRepositoryEnroll(db: PrismaClient): IRepositoryEnroll {
  return new RepositoryEnroll(db);
}

class RepositoryEnroll implements IRepositoryEnroll {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getUserEnroll(courseId: number): Promise<IEnrollment[]> {
    return await this.db.enrollment.findMany({
      where: { courseId },
    });
  }

  async getAllEnroll(): Promise<IEnrollment[]> {
    return await this.db.enrollment.findMany();
  }
}
