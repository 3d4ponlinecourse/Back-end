"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./repositories/user");
const course_1 = require("./repositories/course");
const comment_1 = require("./repositories/comment");
const lesson_1 = require("./repositories/lesson");
const enrollent_1 = require("./repositories/enrollent");
const blacklist_1 = require("./repositories/blacklist");
const user_2 = require("./handlers/user");
const jwt_1 = require("./auth/jwt");
const comments_1 = require("./handlers/comments");
const course_2 = require("./handlers/course");
const lesson_2 = require("./handlers/lesson");
const enrollment_1 = require("./handlers/enrollment");
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
    const repoCouse = (0, course_1.newRepositoryCourse)(db);
    const repoComment = (0, comment_1.newRepositoryComment)(db);
    const repoLesson = (0, lesson_1.newRepositoryLesson)(db);
    const repoEnroll = (0, enrollent_1.newRepositoryEnroll)(db);
    const repoBlacklist = (0, blacklist_1.newRepositoryBlacklist)(redis);
    const handlerUser = (0, user_2.newHandlerUser)(repoUser, repoBlacklist);
    const handlerCourse = (0, course_2.newHandlerCourse)(repoCouse);
    const handlerComment = (0, comments_1.newHandlerComment)(repoComment);
    const handlerLesson = (0, lesson_2.newHandlerLesson)(repoLesson);
    const handlerEnroll = (0, enrollment_1.newHandlerEnroll)(repoEnroll);
    const handlerMiddleware = new jwt_1.HandlerMiddleware(repoBlacklist);
    const port = process.env.PORT || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    const courseRouter = express_1.default.Router();
    const commentRouter = express_1.default.Router();
    const lessonRouter = express_1.default.Router();
    const enrollRouter = express_1.default.Router();
    server.use((0, cors_1.default)());
    server.use(express_1.default.json());
    server.use("/user", userRouter);
    server.use("/course", courseRouter);
    server.use("/lesson", lessonRouter);
    server.use("/comment", commentRouter);
    server.use("/enroll", enrollRouter);
    //check server
    server.get("/", (_, res) => {
        return res.status(200).json({ status: "ok" }).end();
    });
    //user router
    userRouter.post("/register", handlerUser.register.bind(handlerUser));
    userRouter.post("/login", handlerUser.login.bind(handlerUser));
    userRouter.post("/", handlerUser.getUsers.bind(handlerUser));
    userRouter.post("/enroll", handlerUser.enroll.bind(handlerUser));
    userRouter.get("/enroll", handlerUser.getUsersEnroll.bind(handlerUser));
    userRouter.get("/enroll/:id", handlerUser.getUserEnrollById.bind(handlerUser));
    userRouter.patch("/update/:id", handlerUser.updateUser.bind(handlerUser));
    //userRouter.get("/", handlerUser.getUsers.bind(handlerUser));
    userRouter.get("/logout", handlerMiddleware.jwtMiddleware.bind(handlerMiddleware), handlerUser.logout.bind(handlerUser));
    //course
    //courseRouter.use(handlerMiddleware.jwtMiddleware.bind(handlerMiddleware));
    courseRouter.post("/", handlerCourse.createCourse.bind(handlerCourse));
    courseRouter.get("/", handlerCourse.getCourses.bind(handlerCourse));
    courseRouter.get("/:id", handlerCourse.getCourseById.bind(handlerCourse));
    //lesson
    lessonRouter.post("/", handlerLesson.createLesson.bind(handlerLesson));
    lessonRouter.get("/", handlerLesson.getLessons.bind(handlerLesson));
    lessonRouter.get("/:id", handlerLesson.getLessonByCourseId.bind(handlerLesson));
    //comment
    commentRouter.use(handlerMiddleware.jwtMiddleware.bind(handlerMiddleware));
    commentRouter.post("/", handlerComment.createComment.bind(handlerComment));
    commentRouter.get("/", handlerComment.getComments.bind(handlerComment));
    commentRouter.get("/:id", handlerComment.getCommentById.bind(handlerComment));
    commentRouter.patch("/update/:id", handlerComment.updateComment.bind(handlerComment));
    commentRouter.delete("/", handlerComment.deleteComment.bind(handlerComment));
    //enroll
    enrollRouter.get("/", handlerEnroll.getEntolls.bind(handlerEnroll));
    enrollRouter.get("/:id", handlerEnroll.getUserEnroll.bind(handlerEnroll));
    server.listen(port, () => console.log(`server listening on ${port}`));
}
main();
//# sourceMappingURL=index.js.map