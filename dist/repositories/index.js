"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeUser = exports.UserDb = void 0;
const client_1 = require("@prisma/client");
exports.UserDb = new client_1.PrismaClient();
exports.includeUser = {
    user: {
        select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            password: false,
        },
    },
};
//# sourceMappingURL=index.js.map