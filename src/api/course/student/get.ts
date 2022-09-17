import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { ErrorResponse } from "src/types/Error";
import { toUserResponse } from "src/types/UserResponse";

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
      where: { courseId: courseId },
    });

    if (!course) {
      res.status(404).send({ error: "Course not Found." } as ErrorResponse);
      return;
    }

    if (req.user.id !== course.professorId) {
      res.status(403).send({ error: "Permission Denied." } as ErrorResponse);
      return;
    }

    const userCourses = await prisma.userCourse.findMany({
      where: { courseId: course.id },
      include: { student: true },
    });

    const students = await Promise.all(
      userCourses.map((u) => toUserResponse(u.student))
    );

    res.status(200).send(students);
  } catch (err) {
    next(err);
  }
};

export default get;
