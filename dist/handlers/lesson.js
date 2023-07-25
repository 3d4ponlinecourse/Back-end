"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerLesson = void 0;
function newHandlerLesson(repo) {
    return new HandlerLesson(repo);
}
exports.newHandlerLesson = newHandlerLesson;
class HandlerLesson {
    constructor(repo) {
        this.repo = repo;
    }
    //create
    async createLesson(req, res) {
        const { lessonName, videoUrl, duration, courseId } = req.body;
        if (!lessonName || !videoUrl || !duration || !courseId) {
            return res
                .status(400)
                .json({ error: " missing some fields in body" })
                .end();
        }
        try {
            const lesson = await this.repo.createLesson({
                lessonName,
                videoUrl,
                duration,
                courseId,
            });
            return res
                .status(201)
                .json({ ...lesson })
                .end();
        }
        catch (err) {
            const errMsg = `failed to create lesson`;
            console.log({ error: `${errMsg}: ${err}` });
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    //get all
    async getLessons(req, res) {
        try {
            const lessons = await this.repo.getLessons();
            return res.status(200).json(lessons).end();
        }
        catch (err) {
            const errMsg = "failed to get lessons";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    //get by Id
    async getLessonById(req, res) {
        try {
            const id = req.params.id;
            const getLesson = await this.repo.getLessonById(id);
            return res.status(200).json(getLesson).end();
        }
        catch (err) {
            const errMsg = "failed to get lesson by id";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    //get by courseId
    async getLessonByCourseId(req, res) {
        const courseId = req.params.courseId;
        try {
            const lesson = await this.repo.getLessonByCourseId(courseId);
            if (!lesson) {
                return res.status(404).json({ error: "missing course id in params" });
            }
            return res.status(200).json(lesson).end();
        }
        catch (err) {
            const errMsg = "failed to get lesson by course id";
            console.error(`${errMsg} ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
}
//# sourceMappingURL=lesson.js.map