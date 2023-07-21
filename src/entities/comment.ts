export interface ICreateComment {
  comment: string;
  photo?: string | null;
  rating: number;
  userId: string;
}

export interface IComment extends ICreateComment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  courseId: number;
}

export interface IUpdateComment {
  comment: string;
  photo?: string | null;
  rating: number;
  userId: string;
}
