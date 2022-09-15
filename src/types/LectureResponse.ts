import { Lecture, PrismaClient } from "@prisma/client";

export default interface LectureResponse {
  id: number;
  courseId: string;
  courseName?: string;
  lectureTitle: string;
  lectureContent: string;
}

export const toLectureResponse = async (
  lecture: Lecture,
  courseId?: string,
  courseName?: string
): Promise<LectureResponse> => {
  const prisma = new PrismaClient();
  return {
    id: lecture.id,
    courseId:
      courseId ??
      (await prisma.course.findUnique({ where: { id: lecture.courseId } }))
        ?.courseId ??
      "",
    courseName: courseName ?? undefined,
    lectureTitle: lecture.lectureTitle,
    lectureContent: lecture.lectureContent,
  };
};
