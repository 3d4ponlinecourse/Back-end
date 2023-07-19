import { ICreateUser, IUser } from "../entities/user";
import { IRepositoryUser } from ".";
import { PrismaClient } from "@prisma/client";
// import { Prisma, PrismaClient } from "@prisma/client";

//export new repo function
export function newRepositoryUser(db: PrismaClient): IRepositoryUser {
  return new RepositoryUser(db);
}

export interface IWhereUser {
  id?: string;
  username: string;
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
      .then((user) => Promise.resolve(user))
      .catch((err) =>
        Promise.reject(`failed to create user ${user.username}: ${err}`)
      );
  }

  //get user
  async getUser(where: IWhereUser): Promise<IUser> {
    return await this.db.user
      .findUnique({ where })
      .then((user) => {
        if (!user) {
          return Promise.reject(
            `user ${where.id}, ${where.username} not found`
          );
        }

        return Promise.resolve(user);
      })
      .catch((err) =>
        Promise.reject(`failed to get user with condition ${where}: ${err}`)
      );
  }
}
