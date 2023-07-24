export interface ICreateLesson {
  lessonName: string;
  videoUrl: string;
  duration: string;

  courseId: number;
}

export interface ILesson extends ICreateLesson {
  id: number;
}
