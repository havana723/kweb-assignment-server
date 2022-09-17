import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import CourseResponse, { toCourseResponse } from "src/types/CourseResponse";
import { ErrorResponse } from "src/types/Error";

const get: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        error: "Unauthorized.",
      } as ErrorResponse);
      return;
    }

    const courseId = req.query.courseId;

    if (!courseId || typeof courseId !== "string") {
      res.status(400).send({ error: "Invalid courseId." } as ErrorResponse);
      return;
    }

    const prisma = new PrismaClient();
    const course = await prisma.course.findUnique({
      where: {
        courseId,
      },
    });
    if (!course) {
      res.status(404).send({ error: "Course not found." } as ErrorResponse);
      return;
    }

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

    const courseResponse: CourseResponse = await toCourseResponse(course, true);

    res.status(200).send(courseResponse);
  } catch (err) {
    next(err);
  }
};

export default get;
