import { Response } from "express";
import { PrismaClient } from "@prisma/client";

import { IRepositoryComment } from "../repositories";
import { ICreateComment, IComment, IUpdateComment } from "../entities/comment";
import { IHandlerComment, WithID } from ".";
import { JwtAuthRequest } from "../auth/jwt";

//export
export function newHandlerComment(repo: IRepositoryComment): IHandlerComment {
  return new HandlerComment(repo);
}

class HandlerComment implements IHandlerComment {
  private repo: IRepositoryComment;

  constructor(repo: IRepositoryComment) {
    this.repo = repo;
  }

  async createComment(
    req: JwtAuthRequest<{}, ICreateComment>,
    res: Response
  ): Promise<Response> {
    const createComment: ICreateComment = req.body;
    if (!createComment.rating) {
      return res.status(400).json({ error: "missing rating in body" });
    }
    try {
      const userId = req.payload.id;
      const createdComment = await this.repo.createComment({ userId });
      return res.status(201).json(createdComment).end();
    } catch (err) {
      const errMsg = "failed to create comment";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getComments(
    req: JwtAuthRequest<{}, {}>,
    res: Response
  ): Promise<Response> {
    try {
      const comments = await this.repo.getComments();
      return res.status(200).json(comments).end();
    } catch (err) {
      const errMsg = "failed to create comment";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getComment(
    req: JwtAuthRequest<{ id: number }, {}>,
    res: Response
  ): Promise<Response> {
    if (!req.params.id) {
      return res.status(400).json({ error: "missing id in params" }).end();
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id '${id}' is not number` })
        .end();
    }

    try {
      const comment = await this.repo.getCommentById(id);
      if (!comment) {
        return res
          .status(404)
          .json({ error: `no such comment: '${id}'` })
          .end();
      }

      return res.status(200).json(comment).end();
    } catch (err) {
      const errMsg = "failed to create comment";
      console.error(`${errMsg} ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async updateComment(
    req: JwtAuthRequest<WithID, ICreateComment>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: `id` });
    }
    // not finish yet
  }
}
