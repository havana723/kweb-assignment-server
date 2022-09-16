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
    if (req.user.role !== "STUDENT") {
      res.status(403).send({
        error: "Permission denied.",
      } as ErrorResponse);
      return;
    }

    const { courseId } = req.body;

    if (typeof courseId !== "string") {
      res.status(400).send({
        error: "Invalid courseId type.",
      });
      return;
    }

    const prisma = new PrismaClient();
    const course = await prisma.course.findUnique({
      where: { courseId: courseId },
    });

    if (!course) {
      res.status(404).send({
        error: "Course does not exist.",
      } as ErrorResponse);
      return;
    }

    const id = course.id;

    try {
      const userCourse = await prisma.userCourse.create({
        data: {
          studentId: req.user.id,
          courseId: id,
        },
      });

      if (!userCourse) {
        res.status(500).send({
          error: "Failed to resgister course.",
        } as ErrorResponse);
        return;
      }

      res.sendStatus(204);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          res.status(409).send({
            error: "Already registered.",
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
