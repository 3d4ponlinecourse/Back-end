import { IHandlerUser } from ".";
import { IRepositoryBlacklist, IRepositoryUser } from "../repositories";
import { hashPassword, compareHash } from "../auth/bcrypt";
import { Request, Response } from "express";

// import { JwtAuthRequest } from "../auth/jwt";
import { newJwt } from "../auth/jwt";

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

  //register
  async register(req: Request, res: Response): Promise<Response> {
    const { username, password, firstname, lastname, email, gender, role } =
      req.body;
    if (
      !username ||
      !password ||
      !firstname ||
      !lastname ||
      !email ||
      !gender ||
      !role
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
        role,
      });

      return res
        .status(201)
        .json({ ...user, password: undefined })
        .end();
    } catch (err) {
      const errMsg = `failed to create account: ${username}`;
      console.log({ error: `${errMsg}: ${err}` });

      return res.status(500).json({ error: errMsg }).edn();
    }
  }

  //login
  async login(req, res): Promise<Response> {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password" })
        .end();
    }

    try {
      const user = await this.repo.getUser({ username });
      if (!user) {
        return res
          .status(404)
          .json({ error: `no such user: ${username}` })
          .end();
      }

      //create authenticated
      const authenticated = await compareHash(password, user.password);
      if (!authenticated) {
        return res
          .status(401)
          .json({ error: `invalid username or password` })
          .end();
      }
      //create t0ken
      const token = newJwt({ username, id: user.id });

      return res
        .status(200)
        .json({ status: `${username} logged in`, token }) //dont forget to return token
        .end();
    } catch (err) {
      console.error({ error: `failed to get user ${err}` });
      return res.status(500).json({ error: `failed to login` }).end();
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    return await this.repoBlacklist
      .addToBlacklist(req.token)
      .then(() =>
        res.status(200).json({ status: `logged out`, token: req.token }).end()
      );
  }
}
