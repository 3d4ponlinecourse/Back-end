"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const express_1 = __importDefault(require("express"));
const user_1 = require("./repositories/user");
const user_2 = require("./handlers/user");
const blacklist_1 = require("./repositories/blacklist");
const jwt_1 = require("./auth/jwt");
//create main function
async function main() {
    const db = new client_1.PrismaClient();
    const redis = (0, redis_1.createClient)();
    try {
        redis.connect();
        db.$connect();
    }
    catch (err) {
        console.error(err);
        return;
    }
    // expirer?
    const repoUser = (0, user_1.newRepositoryUser)(db);
    const repoBlacklist = (0, blacklist_1.newRepositoryBlacklist)(redis);
    const handlerUser = (0, user_2.newHandlerUser)(repoUser, repoBlacklist);
    const handlerMiddleware = new jwt_1.HandlerMiddleware(repoBlacklist);
    const port = process.env.PORT || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    server.use(express_1.default.json());
    server.use("/user", userRouter);
    //check server
    server.get("/", (_, res) => {
        return res.status(200).json({ status: "ok" }).end();
    });
    //user router
    userRouter.post("/register", handlerUser.register.bind(handlerUser));
    userRouter.post("/login", handlerUser.login.bind(handlerUser));
    userRouter.get("/logout", handlerMiddleware.jwtMiddleware.bind(handlerMiddleware), handlerUser.logout.bind(handlerUser));
    server.listen(port, () => console.log(`server listening on ${port}`));
}
main();
//# sourceMappingURL=index.js.map