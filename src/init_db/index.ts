import { PrismaClient } from "@prisma/client";
import fs from "fs";

import { ICreateCourse } from "../entities/course";
import { ICreateLesson } from "../entities/lesson";

interface Course {
  id: number;
  courseName: string;
  imageUrl: string;
  videoUrl: string;
  duration: string;
  description: string;
  comment: string[];
  lessons: Lesson[];
}

interface Lesson {
  lessonName: string;
  videoUrl: string;
  duration: string;
}

async function main() {
  try {
    const coursesBuf = await fs.readFileSync("./courses/courses.json");
    const courseJson = coursesBuf.toString();

    const courses: Course[] = JSON.parse(courseJson);

    const createCourses: ICreateCourse[] = courses.map((c) => {
      return {
        id: c.id, // Hard-code IDs here
        courseName: c.courseName,
        videoUrl: c.videoUrl,
        imageUrl: c.imageUrl,
        description: c.description,
        duration: c.duration,
      };
    });

    const createLessons: ICreateLesson[] = courses.flatMap(
      (c): ICreateLesson[] => {
        return c.lessons.map((l) => {
          return {
            ...l,
            courseId: c.id,
          };
        });
      }
    );

    const db = new PrismaClient();

    await db.course.createMany({
      data: createCourses,
    });

    await db.lesson.createMany({
      data: createLessons,
    });

    const lessonOne = await db.lesson.findUnique({
      where: { id: 1 },
      include: {
        course: true,
      },
    });

    if (!lessonOne) {
      console.error({ error: `could not find lesson one` });
      return;
    }

    if (lessonOne.course.courseName != "Basics") {
      console.error({ error: `unexpected course on lessonOne: ${lessonOne}` });
      return;
    }

    console.log("init db successful");
  } catch (err) {
    console.error(`got error: ${err}`);
  }
}

main();
