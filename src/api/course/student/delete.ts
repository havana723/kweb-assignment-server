import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { ErrorResponse } from "src/types/Error";

const del: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        error: "Unauthorized.",
      } as ErrorResponse);
      return;
    }

    const { courseId, studentId } = req.body;

    if (!courseId || typeof courseId !== "string") {
      res.status(400).send({ error: "Invalid courseId." } as ErrorResponse);
      return;
    }

    if (!studentId || typeof studentId !== "string") {
      res.status(400).send({ error: "Invalid studentId." } as ErrorResponse);
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

    const student = await prisma.user.findUnique({
      where: { uniqueId: studentId },
    });

    if (!student) {
      res.status(404).send({ error: "Student not Found." } as ErrorResponse);
      return;
    }

    await prisma.userCourse.delete({
      where: {
        studentId_courseId: {
          courseId: course.id,
          studentId: student.id,
        },
      },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default del;
