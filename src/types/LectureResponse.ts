import { Lecture, PrismaClient } from "@prisma/client";

export default interface LectureResponse {
  id: number;
  courseId: string;
  lectureTitle: string;
  lectureContent: string;
}

export const toLectureResponse = async (
  lecture: Lecture,
  courseId?: string
): Promise<LectureResponse> => {
  const prisma = new PrismaClient();
  return {
    id: lecture.id,
    courseId:
      courseId ??
      (await prisma.course.findUnique({ where: { id: lecture.courseId } }))
        ?.courseId ??
      "",
    lectureTitle: lecture.lectureTitle,
    lectureContent: lecture.lectureContent,
  };
};
