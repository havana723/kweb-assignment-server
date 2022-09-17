import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { ErrorResponse } from "src/types/Error";

const post: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        error: "Unauthorized.",
      } as ErrorResponse);
      return;
    }
    if (req.user.role !== "PROFESSOR") {
      res.status(403).send({
        error: "Permission denied.",
      } as ErrorResponse);
      return;
    }

    const { courseId, lectureTitle, lectureContent } = req.body;

    if (
      typeof courseId !== "string" ||
      typeof lectureTitle !== "string" ||
      typeof lectureContent !== "string"
    ) {
      res.status(400).send({
        error: "Invalid courseId or lectureTitle or lectureContent type.",
      });
      return;
    }

    if (lectureTitle.length > 512) {
      res
        .status(400)
        .send({ error: "Lecture Title cannt be longer than 512 letters." });
    }

    const prisma = new PrismaClient();
    const course = await prisma.course.findUnique({
      where: { courseId: courseId },
    });

    if (!course) {
      res.status(404).send({
        error: "Course not found.",
      } as ErrorResponse);
      return;
    }

    const id = course.id;
    const professorId = course.professorId;

    if (req.user.id !== professorId) {
      res.status(403).send({
        error: "Permission denied.",
      } as ErrorResponse);
      return;
    }

    const lecture = await prisma.lecture.create({
      data: {
        courseId: id,
        lectureTitle,
        lectureContent,
        createdAt: new Date(),
      },
    });
    res.status(201).send({ lectureId: lecture.id });
  } catch (err) {
    next(err);
  }
};

export default post;
