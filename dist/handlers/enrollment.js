"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerEnroll = void 0;
//export
function newHandlerEnroll(repo) {
    return new HandlerEnroll(repo);
}
exports.newHandlerEnroll = newHandlerEnroll;
class HandlerEnroll {
    constructor(repo) {
        this.repo = repo;
    }
    async getUserEnroll(req, res) {
        const { courseId } = req.body;
        try {
            const enroll = await this.repo.getUserEnroll(courseId);
            return res.status(200).json(enroll).end();
        }
        catch (err) {
            const errMsg = "failed to get user enrollment";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async getEntolls(req, res) {
        try {
            const enrolls = await this.repo.getAllEnroll();
            return res.status(200).json(enrolls).end();
        }
        catch (err) {
            const errMsg = "failed to get all enrollment";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
}
//# sourceMappingURL=enrollment.js.map