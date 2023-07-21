//import
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import express from "express";

import { newRepositoryUser } from "./repositories/user";

import { newHandlerUser } from "./handlers/user";

import { newRepositoryBlacklist } from "./repositories/blacklist";
import { HandlerMiddleware } from "./auth/jwt";

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
  const repoBlacklist = newRepositoryBlacklist(redis);
  const handlerUser = newHandlerUser(repoUser, repoBlacklist);

  const handlerMiddleware = new HandlerMiddleware(repoBlacklist);

  const port = process.env.PORT || 8000;
  const server = express();
  const userRouter = express.Router();

  server.use(express.json());
  server.use("/user", userRouter);

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

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
