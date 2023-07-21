"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//export
class HandlerComment {
    constructor(repo) {
        this.repo = repo;
    }
    async createComment(req, res) {
        const createComment = req.body;
        if (!createComment.rating) {
            return res.status(400).json({ error: "missing rating in body" });
        }
        try {
            const userId = req.payload.id;
            const createdComment = await this.repo.createComment({ userId });
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
            const errMsg = "failed to create comment";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async getComment(req, res) {
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
                return res.status(404).json({ error: `no such comment: '${id}'` }).end();
            }
        }
        finally {
        }
    }
}
//# sourceMappingURL=comments.js.map