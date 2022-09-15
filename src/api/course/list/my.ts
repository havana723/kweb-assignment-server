import { Course, PrismaClient, UserCourse } from "@prisma/client";
import { RequestHandler } from "express";
import { toCourseResponse } from "src/types/CourseResponse";
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
    let courses: Course[] = [];

    if (req.user.role === "STUDENT") {
      courses = (
        (await prisma.userCourse.findMany({
          where: {
            studentId: req.user.id,
          },
          include: {
            course: true,
          },
        })) as (UserCourse & {
          course: Course;
        })[]
      ).map((i) => i.course);
    } else {
      courses = await prisma.course.findMany({
        where: { professorId: req.user.id },
      });
    }

    const courseResponses = await Promise.all(
      courses.map((c) => toCourseResponse(c))
    );

    res.status(200).send(courseResponses);
  } catch (err) {
    next(err);
  }
};

export default get;
