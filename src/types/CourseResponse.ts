import { Course, PrismaClient } from "@prisma/client";
import LectureResponse, { toLectureResponse } from "./LectureResponse";
import UserResponse, { toUserResponse } from "./UserResponse";

export default interface CourseResponse {
  courseId: string;
  courseName: string;
  professorName: string;
  lectures?: LectureResponse[];
  students?: UserResponse[];
}

export const toCourseResponse = async (
  course: Course,
  needLecture?: boolean,
  needStudents?: boolean
): Promise<CourseResponse> => {
  const prisma = new PrismaClient();
  return {
    courseId: course.courseId,
    courseName: course.courseName,
    professorName:
      (
        await prisma.user.findUnique({
          where: {
            id: course.professorId,
          },
        })
      )?.name ?? "",
    lectures: needLecture
      ? await Promise.all(
          (
            await prisma.lecture.findMany({
              where: {
                courseId: course.id,
              },
            })
          ).map((l) => toLectureResponse(l, course.courseId))
        )
      : undefined,
    students: needStudents
      ? (
          await prisma.userCourse.findMany({
            where: { courseId: course.id },
            include: { student: true },
          })
        ).map((i) => toUserResponse(i.student))
      : undefined,
  };
};
