export interface ICreateComment {
  comment: string;
  photo?: string | null;
  rating: number;
  userId: string;
  courseId: number;
}

export interface IComment extends ICreateComment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateComment {
  comment: string;
  photo?: string | null;
  rating: number;
  userId: string;
}
