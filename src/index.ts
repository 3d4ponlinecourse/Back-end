//import
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import express from "express";

import { newRepositoryUser } from "./repositories/user";

import { newHandlerUser } from "./handlers/user";

import { newRepositoryBlacklist } from "./repositories/blacklist";
import { HandlerMiddleware } from "./auth/jwt";
import { newRepositoryCourse } from "./repositories/course";
import { newRepositoryComment } from "./repositories/comment";
import { newHandlerComment } from "./handlers/comments";
import { newHandlerCourse } from "./handlers/course";
import { newRepositoryLesson } from "./repositories/lesson";
import { newHandlerLesson } from "./handlers/lesson";

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

  const repoBlacklist = newRepositoryBlacklist(redis);

  const handlerUser = newHandlerUser(repoUser, repoBlacklist);
  const handlerCourse = newHandlerCourse(repoCouse);
  const handlerComment = newHandlerComment(repoComment);
  const handlerLesson = newHandlerLesson(repoLesson);

  const handlerMiddleware = new HandlerMiddleware(repoBlacklist);

  const port = process.env.PORT || 8000;
  const server = express();
  const userRouter = express.Router();
  const courseRouter = express.Router();
  const commentRouter = express.Router();
  const lessonRouter = express.Router();

  server.use(express.json());
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

  userRouter.get(
    "/logout",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerUser.logout.bind(handlerUser)
  );

  //course
  //courseRouter.use(handlerMiddleware.jwtMiddleware.bind(handlerMiddleware));
  courseRouter.get("/", handlerCourse.getCourses.bind(handlerCourse));
  courseRouter.get("/:id", handlerCourse.getCourseById.bind(handlerCourse));

  //lesson
  lessonRouter.get("/", handlerLesson.getLessons.bind(handlerLesson));
  lessonRouter.get("/:id", handlerLesson.getLessonById.bind(handlerLesson));

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

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
