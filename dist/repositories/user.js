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
    async getUsers() {
        return await this.db.user.findMany();
    }
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
    async getUserById(id) {
        return await this.db.user.findUnique({ where: { id } });
    }
    async getUsersEnroll() {
        return await this.db.user.findMany({
            include: {
                enrollment: true,
            },
        });
    }
    async getUserEnrollById(id) {
        return await this.db.user.findUnique({
            include: { enrollment: true },
            where: { id },
        });
    }
    async enroll(id, courseId) {
        const course = await this.db.course.findUnique({
            where: { id: courseId },
        });
        if (!course)
            throw new Error("course not found");
        const user = await this.getUserEnrollById(id);
        if (!user)
            throw new Error("student not found");
        const enrollment = await this.db.enrollment.create({
            data: {
                userId: user.id,
                courseId,
                courseName: course.courseName,
            },
        });
        return enrollment;
    }
    async updateUser(id, user) {
        return await this.db.user.update({
            where: { id },
            data: user,
        });
    }
}
//# sourceMappingURL=user.js.map