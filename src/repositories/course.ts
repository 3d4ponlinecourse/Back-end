import { PrismaClient } from "@prisma/client";
import { ICourse, ICreateCourse } from "../entities/course";
import { JwtAuthRequest } from "../auth/jwt";
import { includeUser } from ".";

//export
export function newRepositoryCourse(db: PrismaClient): RepositoryCourse {
  return new RepositoryCourse(db);
}

//create RepositoryCourse class
// class RepositoryCourse {
//   private db: PrismaClient;

//   constructor(db: PrismaClient) {
//     this.db = db;
//   }

//   // //create course
//   // async createCourse(course: ICreateCourse): Promise<ICourse> {
//   //   return this.db.course.create({
//   //     include: includeUser,
//   //     data: {
//   //       ...course,
//   //       userId: undefined,
//   //       user: {
//   //         connect: {
//   //           id: course.userId,
//   //         },
//   //       },
//   //     },
//   //   });
//   // }

//   //getcourse
//   async getCourse(): Promise<ICourse[]> {
//     return await this.db.course
//       .findMany({
//         include: includeUser,
//       })
//       .then((course) => {
//         if (!course) {
//           return Promise.resolve([]);
//         }
//         return Promise.resolve(course);
//       });
//   }

//   //get course by id
// }

class RepositoryCourse {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createCourse (course: ICreateCourse): Promise<ICourse> {
    return await this.db.course.create({
      include: includeUser,
      data: {
        ...course,
        userId: undefined,
        user: {
          connect: {
            id: course.userId
          }
        }
      }
    })
  }

  async getCourse(): Promise<ICourse[]> {
    try 
    return await this.db.course.findMany({
      include: includeUser
    })

    tr
  }







  }




}
