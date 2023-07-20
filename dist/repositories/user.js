"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryUser = void 0;
// import { Prisma, PrismaClient } from "@prisma/client";
//export new repo function
function newRepositoryUser(db) {
    return new RepositoryUser(db);
}
exports.newRepositoryUser = newRepositoryUser;
//create repoUser class
class RepositoryUser {
    constructor(db) {
        this.db = db;
    }
    //create user
    async createUser(user) {
        return await this.db.user
            .create({ data: user })
            .catch((err) => Promise.reject(`failed to create user ${user.username}: ${err}`));
    }
    //get user
    async getUser(username) {
        return await this.db.user
            .findUnique({ where: { username } })
            .then((user) => {
            if (!user) {
                return Promise.reject(`user ${username} not found`);
            }
            return Promise.resolve(user);
        })
            .catch((err) => Promise.reject(`failed to get user with condition ${username}: ${err}`));
    }
}
//# sourceMappingURL=user.js.map