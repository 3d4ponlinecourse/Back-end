"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerCourse = void 0;
//export
function newHandlerCourse(repo) {
    return new HandlerCourse(repo);
}
exports.newHandlerCourse = newHandlerCourse;
class HandlerCourse {
    constructor(repo) {
        this.repo = repo;
    }
    async getCourse(req, res) {
        return this.repo
            .getCourses()
            .then((courses) => res.status(200).json(courses).end())
            .catch((err) => {
            console.error(`failed to get courses: ${err}`);
            return res.status(500).json({ error: `failed to get courses` });
        });
    }
    async getTodoById(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${req.params.id} is not a number` });
        }
        return this.repo
            .getCourseById(id)
            .then((todo) => {
            if (!todo) {
                return res
                    .status(404)
                    .json({ error: `no such todo: ${id}` })
                    .end();
            }
            return res.status(200).json(todo).end();
        })
            .catch((err) => {
            const errMsg = `failed to get todo ${id}: ${err}`;
            console.error(errMsg);
            return res.status(500).json({ error: errMsg });
        });
    }
}
//# sourceMappingURL=course.js.map