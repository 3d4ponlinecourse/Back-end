import { IHandlerUser, AppRequest, Empty, WithUser } from ".";
import { IRepositoryBlacklist, IRepositoryUser } from "../repositories";
import { hashPassword, compareHash } from "../auth/bcrypt";
import { Request, Response } from "express";

// import { JwtAuthRequest } from "../auth/jwt";
import { JwtAuthRequest, newJwt, Payload } from "../auth/jwt";

//export
export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
): IHandlerUser {
  return new HandlerUser(repo, repoBlacklist);
}

//create handler
class HandlerUser implements IHandlerUser {
  private readonly repo: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repo = repo;
    this.repoBlacklist = repoBlacklist;
  }

  //register;
  async register(req: Request, res: Response): Promise<Response> {
    const { username, password, firstname, lastname, email, gender } = req.body;
    if (
      !username ||
      !password ||
      !firstname ||
      !lastname ||
      !email ||
      !gender
    ) {
      return res
        .status(400)
        .json({ error: " missing some fields in body" })
        .end();
    }

    try {
      const user = await this.repo.createUser({
        username,
        firstname,
        lastname,
        password: await hashPassword(password),
        email,
        gender,
      });

      return res
        .status(201)
        .json({ ...user, password: undefined })
        .end();
    } catch (err) {
      const errMsg = `failed to create account: ${username}`;
      console.log({ error: `${errMsg}: ${err}` });

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  //login
  async login(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password" })
        .end();
    }

    try {
      const user = await this.repo.getUser(username);
      if (!compareHash(password, user.password)) {
        return res
          .status(401)
          .json({ error: "invalid name or password" })
          .end();
      }
      const payload: Payload = { id: user.id, username: user.username };
      const token = newJwt(payload);

      return res
        .status(200)
        .json({ status: "logged in", accessToken: token })
        .end();
    } catch (err) {
      const errMsg = `failed to login: ${username}`;
      console.log({ error: `${errMsg}: ${err}` });
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async logout(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return await this.repoBlacklist
      .addToBlacklist(req.token)
      .then(() =>
        res.status(200).json({ status: `logged out`, token: req.token }).end()
      )
      .catch((err) => {
        console.error(`failed to logout: ${err}`);
        return res.status(500).end();
      });
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.repo.getUsers();
      if (!users) return res.status(401).json("failed to get users");
      return res.status(200).json(users);
    } catch (err) {
      const errMsg = `failed to get users`;
      console.log({ error: `${errMsg}: ${err}` });
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getUsersEnroll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.repo.getUsersEnroll();
      if (!users)
        return res.status(401).json("failed to get enrollmented users");
      return res.status(200).json(users).end();
    } catch (err) {
      const errMsg = `failed to get users with enrollment`;
      console.log({ error: `${errMsg}: ${err}` });
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getUserEnrollById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    try {
      const userWithId = await this.repo.getUserEnrollById(id);
      if (!userWithId)
        return res.status(401).json("failed to get enrollmented users");

      return res.status(200).json(userWithId);
    } catch (err) {
      const errMsg = `failed to get enrollmented users`;
      console.log({ error: `${errMsg}: ${err}` });
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async enroll(req: Request, res: Response): Promise<Response> {
    const { userId, courseId } = req.body;
    try {
      const enroll = await this.repo.enroll(userId, courseId);
      if (!enroll)
        return res.status(401).json(`failed to enroll this coures ${courseId}`);
      return res.status(200).json(enroll);
    } catch (err) {
      const errMsg = `failed to get enrollmented users`;
      console.log({ error: `${errMsg}: ${err}` });
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const userId = req.params.userId;
    const { fullname, lastname, email } = req.body;
    try {
      const updated = await this.repo.updateUser(userId, {
        fullname,
        lastname,
        email,
      });
      if (!updated) return res.status(401).json(`userId ${userId} not found `);

      return res.status(200).json(updated);
    } catch (err) {
      const errMsg = `failed to get enrollmented users`;
      console.log({ error: `${errMsg}: ${err}` });
      return res.status(500).json({ error: errMsg }).end();
    }
  }
}
