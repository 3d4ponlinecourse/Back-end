//import
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import express from "express";
import cors from "cors";

import { newRepositoryUser } from "./repositories/user";
import { newRepositoryCourse } from "./repositories/course";
import { newRepositoryComment } from "./repositories/comment";
import { newRepositoryLesson } from "./repositories/lesson";
import { newRepositoryEnroll } from "./repositories/enrollent";

import { newRepositoryBlacklist } from "./repositories/blacklist";

import { newHandlerUser } from "./handlers/user";
import { HandlerMiddleware } from "./auth/jwt";
import { newHandlerComment } from "./handlers/comments";
import { newHandlerCourse } from "./handlers/course";
import { newHandlerLesson } from "./handlers/lesson";
import { newHandlerEnroll } from "./handlers/enrollment";

//create main function
async function main() {
  const db = new PrismaClient();
  const redis = createClient();

  try {
    redis.connect();
    db.$connect();
  } catch (err) {
    console.error(err);
    return;
  }

  // expirer?

  const repoUser = newRepositoryUser(db);
  const repoCouse = newRepositoryCourse(db);
  const repoComment = newRepositoryComment(db);
  const repoLesson = newRepositoryLesson(db);
  const repoEnroll = newRepositoryEnroll(db);

  const repoBlacklist = newRepositoryBlacklist(redis);

  const handlerUser = newHandlerUser(repoUser, repoBlacklist);
  const handlerCourse = newHandlerCourse(repoCouse);
  const handlerComment = newHandlerComment(repoComment);
  const handlerLesson = newHandlerLesson(repoLesson);
  const handlerEnroll = newHandlerEnroll(repoEnroll);

  const handlerMiddleware = new HandlerMiddleware(repoBlacklist);

  const port = process.env.PORT || 8000;
  const server = express();

  const userRouter = express.Router();
  const courseRouter = express.Router();
  const commentRouter = express.Router();
  const lessonRouter = express.Router();
  const enrollRouter = express.Router();

  server.use(cors());
  server.use(express.json());

  server.use("/", userRouter);
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
  userRouter.get(
    "/enroll/:id",
    handlerUser.getUserEnrollById.bind(handlerUser)
  );

  userRouter.patch("/update/:id", handlerUser.updateUser.bind(handlerUser));

  //userRouter.get("/", handlerUser.getUsers.bind(handlerUser));

  userRouter.get(
    "/logout",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerUser.logout.bind(handlerUser)
  );

  //course
  //courseRouter.use(handlerMiddleware.jwtMiddleware.bind(handlerMiddleware));
  courseRouter.post("/", handlerCourse.createCourse.bind(handlerCourse));
  courseRouter.get("/", handlerCourse.getCourses.bind(handlerCourse));
  courseRouter.get("/:id", handlerCourse.getCourseById.bind(handlerCourse));

  //lesson
  lessonRouter.post("/", handlerLesson.createLesson.bind(handlerLesson));
  lessonRouter.get("/", handlerLesson.getLessons.bind(handlerLesson));
  lessonRouter.get(
    "/:id",
    handlerLesson.getLessonByCourseId.bind(handlerLesson)
  );

  //comment
  commentRouter.use(handlerMiddleware.jwtMiddleware.bind(handlerMiddleware));
  commentRouter.post("/", handlerComment.createComment.bind(handlerComment));
  commentRouter.get("/", handlerComment.getComments.bind(handlerComment));
  commentRouter.get("/:id", handlerComment.getCommentById.bind(handlerComment));
  commentRouter.patch(
    "/update/:id",
    handlerComment.updateComment.bind(handlerComment)
  );
  commentRouter.delete("/", handlerComment.deleteComment.bind(handlerComment));

  //enroll
  enrollRouter.get("/", handlerEnroll.getEntolls.bind(handlerEnroll));
  enrollRouter.get("/:id", handlerEnroll.getUserEnroll.bind(handlerEnroll));

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
