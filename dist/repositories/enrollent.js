"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryEnroll = void 0;
//export
function newRepositoryEnroll(db) {
    return new RepositoryEnroll(db);
}
exports.newRepositoryEnroll = newRepositoryEnroll;
class RepositoryEnroll {
    constructor(db) {
        this.db = db;
    }
    async getUserEnroll(courseId) {
        return await this.db.enrollment.findMany({
            where: { courseId },
        });
    }
    async getAllEnroll() {
        return await this.db.enrollment.findMany();
    }
}
//# sourceMappingURL=enrollent.js.map