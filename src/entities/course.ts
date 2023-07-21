export interface ICreateCourse {
  courseName: string;
  videoUrl: string;
  duration: number;
  description: string;
}

export interface ICourse extends ICreateCourse {
  id: number;
  userId: string;
}

updatedAt: Date;
