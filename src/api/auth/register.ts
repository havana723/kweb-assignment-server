import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { ErrorResponse } from "../../types/Error";

const post: RequestHandler = async (req, res, next) => {
  try {
    const { username, password, name, uniqueId, role } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).send({
        error: "Invalid username or password type.",
      });
      return;
    }

    const idReg = /^[a-z0-9]{4,32}$/g;
    if (!idReg.test(username)) {
      res.status(400).send({
        error: "Invalid username format.",
      } as ErrorResponse);
      return;
    }

    const pwReg =
      /^([a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,32}$/g;
    if (!pwReg.test(password)) {
      res.status(400).send({
        error: "Invalid password format.",
      } as ErrorResponse);
      return;
    }
    const passwordHash = await bcrypt.hashSync(password, 10);

    if (typeof name !== "string" || name.length > 512) {
      res.status(400).send({
        error: "Invalid name format.",
      } as ErrorResponse);
      return;
    }

    const uniqueIdReg = /^[0-9]{10}$/g;
    if (!uniqueIdReg.test(uniqueId)) {
      res.status(400).send({
        error: "Invalid uniqueId format.",
      } as ErrorResponse);
      return;
    }

    if (role != "PROFESSOR" && role != "STUDENT") {
      res.status(400).send({
        error: "Invalid role format.",
      } as ErrorResponse);
      return;
    }

    try {
      const prisma = new PrismaClient();
      const user = await prisma.user.create({
        data: {
          username,
          passwordHash,
          name,
          uniqueId,
          role,
        },
      });
      res.status(201).send({ username: user.username });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          res.status(409).send({
            error: "username or uniqueId already exists.",
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
