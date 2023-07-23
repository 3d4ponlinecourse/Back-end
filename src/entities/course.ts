export interface ICreateCourse {
  courseName: string;
  videoUrl: string;
  duration: number;
  description: string;
  userId: string;
}

export interface ICourse extends ICreateCourse {
  id: number;
}

updatedAt: Date;
