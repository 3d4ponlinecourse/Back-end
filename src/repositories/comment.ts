import { PrismaClient } from "@prisma/client";
import { IRepositoryComment } from ".";
import { ICreateComment, ICommentWithUserDto } from "../entities/comment";

//export function

export function newRepositoryComment(db: PrismaClient): IRepositoryComment {
  return new RepositoryComment(db);
}

//create user for include
const includeUserDto = {
  user: {
    select: {
      id: true,
      username: true,
      registeredAt: true,
      password: false,
    },
  },
};

//create class
class RepositoryComment {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  //create comment
  async createComment(arg: ICreateComment): Promise<ICommentWithUserDto> {
    return await this.db.comment.create({
      include: includeUserDto,
      data: {
        ...arg,
        userId: undefined,
        user: {
          connect: {
            id: arg.userId,
          },
          course: {
            connect: {
              id: arg.courseId,
            },
          },
        },
      },
    });
  }

  //get comments
  async getComments(): Promise<ICommentWithUserDto[]> {
    return await this.db.comment
      .findMany({
        include: includeUserDto,
      })
      // co
      .then((comments) => {
        if (!comments) {
          return Promise.resolve([]);
        }
        return Promise.resolve(comments);
      })
      .catch((err) => Promise.reject(`failed to get comments ${err}`));
  }

  //get comment by id
  async getComment(id: number): Promise<ICommentWithUserDto> {
    return await this.db.comment
      .findFirst({
        include: includeUserDto,
      })
      .then((comment) => {
        if (!comment) {
          return Promise.reject(`content ${id} not found`);
        }
        return Promise.resolve(comment);
      });
  }

  //update
  async updateComment(
    where: { id: number; userId: string },
    data: { rating: number | undefined; comment: string | undefined }
  ): Promise<ICommentWithUserDto> {
    return await this.db.comment
      .update({ include: includeUserDto, where, data })
      .catch((err) => {
        return Promise.reject(
          `failed to update content ${where} with data ${data}`
        );
      });
  }

  //delete
  async deleteUserContent(where: {
    id: number;
    userId: string;
  }): Promise<ICommentWithUserDto> {
    return await this.db.comment
      .delete({ include: includeUserDto, where: where })
      .then((comment) => Promise.resolve(comment))
      .catch((err) =>
        Promise.reject(`failed to delete content ${where.id}: ${err}`)
      );
  }
}
