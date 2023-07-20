"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryComment = void 0;
//export function
function newRepositoryComment(db) {
    return new RepositoryComment(db);
}
exports.newRepositoryComment = newRepositoryComment;
//create user for include
const includeUserDto = {
    user: {
        select: {
            id: true,
            username: true,
            fullname: true,
            registeredAt: true,
            password: false,
        },
    },
};
//create class
class RepositoryComment {
    constructor(db) {
        this.db = db;
    }
    //create comment
    async createComment(comment) {
        return await this.db.comment.create({
            include: includeUserDto,
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
    async getComments() {
        return await this.db.comment
            .findMany({
            include: includeUserDto,
        })
            // co
            .then((!comments), {
            if(, comments) {
                return Promise.resolve([]);
            },
            return: Promise.resolve(comments)
        })
            .catch((err) => Promise.reject(`failed to get comments ${err}`));
    }
    //get comment by id
    async getComment(id) {
        return await this.db.comment.findFirst({
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
    async updateComment(where, data) {
        return await this.db.comment
            .update({ include: includeUserDto, where, data })
            .catch((err) => {
            return Promise.reject(`failed to update content ${where} with data ${data}`);
        });
    }
    //delete
    async deleteUserContent(where) {
        return await this.db.comment.delete({ include: includeUserDto, where: where }).then((comment) => Promise.resolve(comment)).catch((err) => Promise.reject(`failed to delete content ${where.id}: ${err}`));
    }
}
//# sourceMappingURL=comment.js.map