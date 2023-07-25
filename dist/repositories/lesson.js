"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryLesson = void 0;
//export
function newRepositoryLesson(db) {
    return new RepositoryLesson(db);
}
exports.newRepositoryLesson = newRepositoryLesson;
class RepositoryLesson {
    constructor(db) {
        this.db = db;
    }
    async createLesson(les) {
        return await this.db.lesson.create({
            data: {
                ...les,
                courseId: undefined,
                course: {
                    connect: { id: les.courseId },
                },
            },
        });
    }
    async getLessons() {
        return await this.db.lesson.findMany();
    }
    async getLessonById(id) {
        return await this.db.lesson.findUnique({ where: { id } });
    }
    async getLessonByCourseId(id) {
        return await this.db.lesson.findMany({
            where: { courseId: id },
        });
    }
}
//# sourceMappingURL=lesson.js.map