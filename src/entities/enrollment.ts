import { IUser } from "./user";

export interface IEnrollment {
  id: number;
  userId: string;
  courseId: number;
  courseName: string;
}

export interface IUserWithEnrollment extends IUser {
  enrollment: IEnrollment[];
}
