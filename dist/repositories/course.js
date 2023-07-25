"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryCourse = void 0;
//export function
function newRepositoryCourse(db) {
    return new RepositortCourse(db);
}
exports.newRepositoryCourse = newRepositoryCourse;
class RepositortCourse {
    constructor(db) {
        this.db = db;
    }
    async createCourse(course) {
        return await this.db.course.create({
            data: {
                courseName: course.courseName,
                videoUrl: course.videoUrl,
                duration: course.duration,
                description: course.description,
            },
        });
    }
    //get course
    async getCourses() {
        return await this.db.course.findMany({});
    }
    //waiting for connected with comments
    async getCourseById(id) {
        return await this.db.course.findUnique({
            where: {
                id,
            },
        });
    }
}
//# sourceMappingURL=course.js.map