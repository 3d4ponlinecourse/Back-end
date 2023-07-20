import { Response } from "express";

import {
  ICreateCommentDto,
  toICommentDto,
  toICommentDtos,
} from "../entities/comment";

import { IRepositoryComment } from "../repositories";
import { IHandlerComment } from ".";
import { JwtAuthRequest } from "../auth/jwt";

//export function

//create class
class HandlerComment implements IHandlerComment {
  private readonly repo: IRepositoryComment;

  constructor(repo: IRepositoryComment) {
    this.repo = repo;
  }

  async createComment(
    req: JwtAuthRequest<{},ICreateCommentDto>, 
    res: Response,
    ): Promise<Response> {
    const {comment} = req.body;
    if(!comment){
        return res.status(400).json({error: "missing comment"}).end()
    }

    try{
        const userId = req.payload.id
        const createComment = await this.repo.createComment(comment,userId)

        return res.status(201).json(toICommentDto(createComment)).end()
    } catch(err) {
        const errMsg ="failed to create comment"
        console.error(`${errMsg}` ${err})
        return res.status(500).json({error: errMsg}).end()
    }
  };

  async getComments(req: JwtAuthRequest<{},{}>, res: Response): Promise<Response> {
    try {
        const userId = req.payload.id
        const contents = await this.repo.getComments(userId)

        return res.status(200).json(toICommentDtos(contents)).end()
    } catch (err) {
        const errMsg ="failed to create comment"
        console.error(`${errMsg}` ${err})

        return res.status(500).json({error: errMsg}).end()
    }
  }


  async getComment (
    req: JwtAuthRequest<{id: number},{}>,
    res: Response): 
    Promise<Response> {
    
    if(!req.params.id) {
            return res.status(400).json({error: "missing Id in params"}).end()
        }

        const id = Number(req.params.id) 
        if (isNaN(id)) {
            return res.status(400).json({error: `id ${id} is not number`}).end()
        }

        try{
            const comment = await this.repo.getComment(id)
            if(!comment) {
                return res.status(404).json({error: `no such content: ${id}`}).end()
            }
            
            return res.status(200).json(toICommentDto(comment)).end()
        
        } catch (err) {
        const errMsg ="failed to create comment"
        console.error(`${errMsg}` ${err})

        return res.status(500).json({error: errMsg}).end()
        }
  }




}
