"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryComment = void 0;
const _1 = require(".");
//export
function newRepositoryComment(db) {
    return new RepositoryComment(db);
}
exports.newRepositoryComment = newRepositoryComment;
class RepositoryComment {
    constructor(db) {
        this.db = db;
    }
    async createComment(comment) {
        return this.db.comment.create({
            include: _1.includeUser,
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
            include: _1.includeUser,
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
    async getCommentById(id) {
        return await this.db.comment
            .findFirst({ include: _1.includeUser })
            .then((comment) => {
            if (!comment) {
                return Promise.reject(`comment ${id} not found`);
            }
            return Promise.resolve(comment);
        })
            .catch((err) => Promise.reject(`failed to get content ${id}: ${err}`));
    }
    async updateComment(where, data) {
        return await this.db.comment
            .update({ include: _1.includeUser, where, data })
            .catch((err) => {
            return Promise.reject(`failed to update content ${where} with data ${data}`);
        });
    }
    async deleteComment(where) {
        return await this.db.comment
            .delete({ include: _1.includeUser, where: where })
            .then((comment) => Promise.resolve(comment))
            .catch((err) => Promise.reject(`failed to delete content ${where.id}: ${err}: `));
    }
}
//# sourceMappingURL=comment.js.map