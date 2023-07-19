import { PrismaClient } from "@prisma/client";

import { IWhereUser } from "./user";
import { ICreateUser, IUser } from "../entities/user";

export const UserDb = new PrismaClient();

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(where: IWhereUser): Promise<IUser>;
}

export interface IRepositoryBlacklist {
  addToBlacklist(token: string): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
}

export interface IRepositoryComment {}
