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

    const prisma = new PrismaClient();
    const courses = await prisma.course.findMany();

    const courseResponses: CourseResponse[] = await Promise.all(
      courses.map((course) => toCourseResponse(course))
    );

    res.status(200).send(courseResponses);
  } catch (err) {
    next(err);
  }
};

export default get;
