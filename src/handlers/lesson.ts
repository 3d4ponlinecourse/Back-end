import { Request, Response } from "express";

import { IRepositoryLesson } from "../repositories";
import { IHandlerLesson } from ".";

export function newHandlerLesson(repo: IRepositoryLesson): IHandlerLesson {
  return new HandlerLesson(repo);
}

class HandlerLesson implements IHandlerLesson {
  private repo: IRepositoryLesson;

  constructor(repo: IRepositoryLesson) {
    this.repo = repo;
  }

  //create
  async createLesson(req: Request, res: Response): Promise<Response> {
    const { lessonName, videoUrl, duration, courseId } = req.body;

    if (!lessonName || !videoUrl || !duration || !courseId) {
      return res
        .status(400)
        .json({ error: " missing some fields in body" })
        .end();
    }

    try {
      const lesson = await this.repo.createLesson({
        lessonName,
        videoUrl,
        duration,
        courseId,
      });

      return res
        .status(201)
        .json({ ...lesson })
        .end();
    } catch (err) {
      const errMsg = `failed to create lesson`;
      console.log({ error: `${errMsg}: ${err}` });

      return res.status(500).json({ error: errMsg }).end();
    }
  }

  //get all
  async getLessons(req: Request, res: Response): Promise<Response> {
    try {
      const lessons = await this.repo.getLessons();
      return res.status(200).json(lessons).end();
    } catch (err) {
      const errMsg = "failed to get lessons";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  //get by Id
  async getLessonById(
    req: Request<{ id: number }>,
    res: Response
  ): Promise<Response> {
    try {
      const id = req.params.id;
      const getLesson = await this.repo.getLessonById(id);
      return res.status(200).json(getLesson).end();
    } catch (err) {
      const errMsg = "failed to get lesson by id";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  //get by courseId
  async getLessonByCourseId(
    req: Request<{ courseId: number }>,
    res: Response
  ): Promise<Response> {
    const courseId = req.params.courseId;
    try {
      const lesson = await this.repo.getLessonByCourseId(courseId);
      if (!lesson) {
        return res.status(404).json({ error: "missing course id in params" });
      }
      return res.status(200).json(lesson).end();
    } catch (err) {
      const errMsg = "failed to get lesson by course id";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }
}
