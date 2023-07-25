"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerComment = void 0;
//export
function newHandlerComment(repo) {
    return new HandlerComment(repo);
}
exports.newHandlerComment = newHandlerComment;
class HandlerComment {
    constructor(repo) {
        this.repo = repo;
    }
    async createComment(req, res) {
        const createComment = req.body;
        if (!createComment.rating) {
            return res.status(400).json({ error: "missing rating in body" });
        }
        //const userId = req.payload.id;
        try {
            const createdComment = await this.repo.createComment({
                ...createComment,
            });
            return res.status(201).json(createdComment).end();
        }
        catch (err) {
            const errMsg = "failed to create comment";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async getComments(req, res) {
        try {
            const comments = await this.repo.getComments();
            return res.status(200).json(comments).end();
        }
        catch (err) {
            const errMsg = "failed to get comments";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async getCommentById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: "missing id in params" }).end();
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id '${id}' is not number` })
                .end();
        }
        try {
            const comment = await this.repo.getCommentById(id);
            if (!comment) {
                return res
                    .status(404)
                    .json({ error: `no such comment: '${id}'` })
                    .end();
            }
            return res.status(200).json(comment).end();
        }
        catch (err) {
            const errMsg = "failed to create comment";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async updateComment(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: `id` });
        }
        let comment = req.body.comment;
        let rating = req.body.rating;
        if (!comment) {
            return res
                .status(400)
                .json({ error: "missing comment in json body" })
                .end();
        }
        return this.repo
            .updateComment({ id, userId: req.payload.id }, { rating, comment })
            .then((updated) => res.status(201).json(updated).end())
            .catch((err) => {
            const errMsg = "failed to create comment";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        });
    }
    async deleteComment(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: `id ${id} is not a number` });
        }
        return this.repo
            .deleteComment({ id, userId: req.payload.id })
            .then((deleted) => res.status(200).json(deleted).end())
            .catch((err) => {
            console.error(`failed to delete comment ${id}: ${err}`);
            return res
                .status(500)
                .json({ error: `failed to delete comment ${id}` });
        });
    }
}
//# sourceMappingURL=comments.js.map