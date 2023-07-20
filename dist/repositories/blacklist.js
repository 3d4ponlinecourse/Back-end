"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryBlacklist = exports.ketJwtExpire = exports.keyBlacklist = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//set
exports.keyBlacklist = "todo-jwt-blacklist";
//hash
exports.ketJwtExpire = "todo-jwt-expirations";
//export
function newRepositoryBlacklist(db) {
    return new RepositoryBlacklist(db);
}
exports.newRepositoryBlacklist = newRepositoryBlacklist;
//create class
class RepositoryBlacklist {
    constructor(db) {
        this.db = db;
    }
    async sAdd(token) {
        await this.db.sAdd(exports.keyBlacklist, token);
    }
    async addToBlacklist(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded) {
            return this.sAdd(token);
        }
        if (typeof decoded === "string") {
            return this.sAdd(token);
        }
        const exp = decoded.exp;
        if (!exp) {
            return this.sAdd(token);
        }
        await this.sAdd(token);
        await this.db.hSet(exports.ketJwtExpire, token, exp);
    }
    async isBlacklisted(token) {
        return await this.db.sIsMember(exports.keyBlacklist, token);
    }
}
//# sourceMappingURL=blacklist.js.map