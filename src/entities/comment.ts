import { IUserDto } from "./user";

export interface ICreateCommentDto {
  comment: string;
  rating: number;
  photo?: string;
}

export interface ICreateComment extends ICreateCommentDto {
  userId: string;
  courseId: number;
}

export interface IComment extends ICreateComment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentWithUserDto extends IComment {
  user: IUserDto;
}

//remover userId and user from IConmentWithUserDto
export interface ICommentDto
  extends Omit<Omit<ICommentWithUserDto, "userId">, "user"> {
  postedBy: IUserDto;
}

export function toICommentDto(data: ICommentWithUserDto): ICommentDto {
  return {
    ...data,
    postedBy: data.user,
  };
}

// create function toICommentDtos that reciever array of ICommentWithUserDto and return arr of IContentDto
export function toICommentDtos(data: ICommentWithUserDto[]): ICommentDto[] {
  return data.map((data) => toICommentDto(data));
}
