"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
//export
//create RepositoryCourse class
class RepositoryCourse {
    constructor(db) {
        this.db = db;
    }
    //create course
    async createCourse(course) {
        return this.db.course.create({
            include: _1.includeUser,
            data: {
                ...course,
                userId: undefined,
                user: {
                    connect: {
                        id: course.userId,
                    },
                },
            },
        });
    }
    async getCourse() {
        return await this.db.course
            .findMany({
            include: _1.includeUser,
        })
            .then((course) => {
            if (!course) {
                return Promise.resolve([]);
            }
            return Promise.resolve(course);
        });
    }
}
//# sourceMappingURL=course.js.map