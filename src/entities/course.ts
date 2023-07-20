// export interface ICreateCourse {
//   courseName: string;
//   videoUrl: string;
//   imageUrl: string;
//   duration: number;
//   description: string;
//   teacherName: string;
//   userId: string;
// }

export interface ICreateCourse {
  courseId: number;
  courseName: string;
  videoUrl: string;
  imageUrl: string;
  duration: number;
  description: string;
  teacherName: string;
  userId: string;
}

export interface ICourse extends ICreateCourse {
  userId: string;
}
