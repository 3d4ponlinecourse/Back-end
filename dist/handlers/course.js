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
    //create course
    async createCourse(req, res) {
        const { courseName, videoUrl, duration, description, imageUrl } = req.body;
        if (!courseName || !videoUrl || !duration || !description || !imageUrl) {
            return res
                .status(400)
                .json({ error: " missing some fields in body" })
                .end();
        }
        try {
            const course = await this.repo.createCourse({
                courseName,
                videoUrl,
                duration,
                imageUrl,
                description,
            });
            return res.status(200).json(course).end();
        }
        catch (err) {
            const errMsg = "failed to create course";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    //get courses
    async getCourses(req, res) {
        try {
            const courses = await this.repo.getCourses();
            return res.status(200).json(courses).end();
        }
        catch (err) {
            const errMsg = "failed to get courses";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    //get course by Id
    async getCourseById(req, res) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: `id ${id} is not a number` });
        }
        try {
            const course = await this.repo.getCourseById(id);
            if (!course) {
                return res.status(404).json({ error: `no course ${id}` });
            }
            return res.status(200).json(course).end();
        }
        catch (err) {
            const errMsg = `failed to get courses id: ${id}`;
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
}
//# sourceMappingURL=course.js.map