import { Request, Response } from "express";
import { IRepositoryEnroll } from "../repositories";
import { IHandlerEnroll } from ".";

//export
export function newHandlerEnroll(repo: IRepositoryEnroll): IHandlerEnroll {
  return new HandlerEnroll(repo);
}

class HandlerEnroll implements IHandlerEnroll {
  private repo: IRepositoryEnroll;

  constructor(repo: IRepositoryEnroll) {
    this.repo = repo;
  }

  async getUserEnroll(req: Request, res: Response): Promise<Response> {
    const { courseId } = req.body;

    try {
      const enroll = await this.repo.getUserEnroll(courseId);
      return res.status(200).json(enroll).end();
    } catch (err) {
      const errMsg = "failed to get user enrollment";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getEntolls(req: Request, res: Response): Promise<Response> {
    try {
      const enrolls = await this.repo.getAllEnroll();

      return res.status(200).json(enrolls).end();
    } catch (err) {
      const errMsg = "failed to get all enrollment";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }
}
