import { PrismaClient } from "@prisma/client";

import { IRepositoryComment, includeUser } from ".";
import { ICreateComment, IComment } from "../entities/comment";

//export
export function newRepositoryComment(db: PrismaClient): IRepositoryComment {
  return new RepositoryComment(db);
}

class RepositoryComment implements IRepositoryComment {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createComment(comment: ICreateComment): Promise<IComment> {
    return this.db.comment.create({
      include: includeUser,
      data: {
        ...comment,
        userId: undefined,
        user: {
          connect: {
            id: comment.userId,
          },
        },
      },
    });
  }

  //get comments
  async getComments(): Promise<IComment[]> {
    return await this.db.comment
      .findMany({
        include: includeUser,
      })
      .then((comments) => {
        if (!comments) {
          return Promise.resolve([]);
        }

        return Promise.resolve(comments);
      })
      .catch((err) => Promise.reject(`failed to get comments: ${err}`));
  }

  //get comment by Id
  async getCommentById(id: number): Promise<IComment> {
    return await this.db.comment
      .findFirst({ include: includeUser })
      .then((comment) => {
        if (!comment) {
          return Promise.reject(`comment ${id} not found`);
        }

        return Promise.resolve(comment);
      })
      .catch((err) => Promise.reject(`failed to get content ${id}: ${err}`));
  }

  async updateComment(
    where: { id: number; userId: string },
    data: { rating: number | undefined; comment: string }
  ): Promise<IComment> {
    return await this.db.comment
      .update({ include: includeUser, where, data })
      .catch((err) => {
        return Promise.reject(
          `failed to update content ${where} with data ${data}`
        );
      });
  }

  async deleteComment(where: {
    id: number;
    userId: string;
  }): Promise<IComment> {
    return await this.db.comment
      .delete({ include: includeUser, where: where })
      .then((comment) => Promise.resolve(comment))
      .catch((err) =>
        Promise.reject(`failed to delete content ${where.id}: ${err}: `)
      );
  }
}
