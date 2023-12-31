import { IComment } from "./comment";
import { IEnrollment } from "./enrollment";
import { ILesson } from "./lesson";

export interface ICreateCourse {
  courseName: string;
  videoUrl: string | null;
  duration: string;
  imageUrl: string | null;
  description: string;
}

export interface ICourse extends ICreateCourse {
  id: number;
  enrollment?: IEnrollment[];
  lesson?: ILesson[];
  comment?: IComment[];
}
