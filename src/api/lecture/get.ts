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

    const lectureId = req.query.lectureId;

    if (
      !lectureId ||
      typeof lectureId !== "string" ||
      Number.isNaN(+lectureId)
    ) {
      res.status(400).send({ error: "Invalid lectureId." } as ErrorResponse);
      return;
    }

    const prisma = new PrismaClient();

    const lectureCourse = await prisma.lecture.findUnique({
      where: {
        id: +lectureId,
      },
      include: {
        course: true,
      },
    });

    if (!lectureCourse) {
      res.status(404).send({ error: "Lecture not found." } as ErrorResponse);
      return;
    }

    const { course, ...lecture } = lectureCourse;

    const isStudent = !!(await prisma.userCourse.findUnique({
      where: {
        studentId_courseId: {
          courseId: course.id,
          studentId: req.user.id,
        },
      },
    }));

    const isProfessor = req.user.id === course.professorId;

    if (!isProfessor && !isStudent) {
      res.status(403).send({
        error: "Permission denied.",
      } as ErrorResponse);
      return;
    }

    const lectureResponse = await toLectureResponse(
      lecture,
      course.courseId,
      course.courseName
    );

    res.status(200).send(lectureResponse);
  } catch (err) {
    next(err);
  }
};

export default get;
