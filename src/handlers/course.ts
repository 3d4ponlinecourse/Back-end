import { Response } from "express";

import { IRepositoryCourse } from "../repositories";
import { Empty, IHandlerCourse, WithID } from ".";
import { JwtAuthRequest } from "../auth/jwt";

//export
export function newHandlerCourse(repo: IRepositoryCourse): IHandlerCourse {
  return new HandlerCourse(repo);
}

class HandlerCourse implements IHandlerCourse {
  private repo: IRepositoryCourse;

  constructor(repo: IRepositoryCourse) {
    this.repo = repo;
  }

  async getCourses(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return this.repo
      .getCourses()
      .then((courses) => res.status(200).json(courses).end())
      .catch((err) => {
        console.error(`failed to get courses: ${err}`);
        return res.status(500).json({ error: `failed to get courses` });
      });
  }

  async getCourseById(
    req: JwtAuthRequest<WithID, Empty>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .getCourseById(id)
      .then((todo) => {
        if (!todo) {
          return res
            .status(404)
            .json({ error: `no such todo: ${id}` })
            .end();
        }

        return res.status(200).json(todo).end();
      })
      .catch((err) => {
        const errMsg = `failed to get todo ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }
}
