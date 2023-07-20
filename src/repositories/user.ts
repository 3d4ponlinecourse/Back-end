import { PrismaClient } from "@prisma/client";

import { ICreateUser, IUser } from "../entities/user";
import { IRepositoryUser } from ".";
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
}
