import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { ErrorResponse } from "src/types/Error";
import { toLectureResponse } from "src/types/LectureResponse";

const get: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        error: "Unauthorized.",
      } as ErrorResponse);
      return;
    }

    if (req.user.role !== "STUDENT") {
      res.status(403).send({
        error: "Permission Denied.",
      } as ErrorResponse);
      return;
    }

    const prisma = new PrismaClient();

    const userCourses = await prisma.userCourse.findMany({
      where: { studentId: req.user.id },
    });
    const courseIds = userCourses.map((c) => c.courseId);

    const lectureCourses = await prisma.lecture.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const lectureResponses = await Promise.all(
      lectureCourses.map((l) =>
        toLectureResponse(l, l.course.courseId, l.course.courseName)
      )
    );

    res.status(200).send(lectureResponses);
  } catch (err) {
    next(err);
  }
};

export default get;
