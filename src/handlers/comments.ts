import { Response } from "express";

import { IRepositoryComment } from "../repositories";
import { ICreateComment } from "../entities/comment";
import { IHandlerComment, WithComment, WithID } from ".";
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
    //const userId = req.payload.id;

    try {
      const createdComment = await this.repo.createComment({
        ...createComment,
      });
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

  async getCommentById(
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
    req: JwtAuthRequest<WithID, WithComment>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: `id` });
    }
    let comment: string | undefined = req.body.comment;
    let rating: number | undefined = req.body.rating;

    if (!comment) {
      return res
        .status(400)
        .json({ error: "missing comment in json body" })
        .end();
    }

    return this.repo
      .updateComment({ id, userId: req.payload.id }, { rating, comment })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        const errMsg = "failed to create comment";
        console.error(`${errMsg} ${err}`);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async deleteComment(
    req: JwtAuthRequest<WithID, WithComment>,
    res: Response
  ): Promise<Response> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: `id ${id} is not a number` });
    }

    return this.repo
      .deleteComment({ id, userId: req.payload.id })
      .then((deleted) => res.status(200).json(deleted).end())
      .catch((err) => {
        console.error(`failed to delete comment ${id}: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to delete comment ${id}` });
      });
  }
}
