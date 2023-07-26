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
        console.error(`failed to logout`);
        return res.status(500).end();
      });
  }
}
