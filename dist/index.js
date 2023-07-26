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
const course_1 = require("./repositories/course");
const comment_1 = require("./repositories/comment");
const comments_1 = require("./handlers/comments");
const course_2 = require("./handlers/course");
const lesson_1 = require("./repositories/lesson");
const lesson_2 = require("./handlers/lesson");
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
    const repoBlacklist = (0, blacklist_1.newRepositoryBlacklist)(redis);
    const handlerUser = (0, user_2.newHandlerUser)(repoUser, repoBlacklist);
    const handlerCourse = (0, course_2.newHandlerCourse)(repoCouse);
    const handlerComment = (0, comments_1.newHandlerComment)(repoComment);
    const handlerLesson = (0, lesson_2.newHandlerLesson)(repoLesson);
    const handlerMiddleware = new jwt_1.HandlerMiddleware(repoBlacklist);
    const port = process.env.PORT || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    const courseRouter = express_1.default.Router();
    const commentRouter = express_1.default.Router();
    const lessonRouter = express_1.default.Router();
    server.use(express_1.default.json());
    server.use("/user", userRouter);
    server.use("/course", courseRouter);
    server.use("/lesson", lessonRouter);
    server.use("/comment", commentRouter);
    //check server
    server.get("/", (_, res) => {
        return res.status(200).json({ status: "ok" }).end();
    });
    //user router
    userRouter.post("/register", handlerUser.register.bind(handlerUser));
    userRouter.post("/login", handlerUser.login.bind(handlerUser));
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
    server.listen(port, () => console.log(`server listening on ${port}`));
}
main();
//# sourceMappingURL=index.js.map