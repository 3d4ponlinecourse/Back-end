"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepository = void 0;
//export function
function newRepository(db) {
    return new RepositortCourse(db);
}
exports.newRepository = newRepository;
class RepositortCourse {
    constructor(db) {
        this.db = db;
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