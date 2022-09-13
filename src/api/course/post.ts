import { Prisma, PrismaClient } from "@prisma/client";
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

    const { courseName, courseId } = req.body;

    if (typeof courseName !== "string" || typeof courseId !== "string") {
      res.status(400).send({
        error: "Invalid courseName or courseId type.",
      });
      return;
    }

    const courseNameReg = /^[a-zA-Z0-9가-힣]{4,32}$/g;
    if (!courseNameReg.test(courseName)) {
      res.status(400).send({
        error: "Invalid courseName format.",
      } as ErrorResponse);
      return;
    }

    const courseIdReg = /^[A-Z]{4}-[0-9]{3}$/g;
    if (!courseIdReg.test(courseId)) {
      res.status(400).send({
        error: "Invalid courseId format.",
      } as ErrorResponse);
      return;
    }

    try {
      const prisma = new PrismaClient();
      const user = await prisma.course.create({
        data: {
          courseName,
          courseId,
          professorId: req.user.id,
        },
      });
      res.status(201).send({ courseId: courseId });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          res.status(409).send({
            error: "cousreId already exists.",
          });
          return;
        }
      }
      throw e;
    }
  } catch (err) {
    next(err);
  }
};

export default post;
