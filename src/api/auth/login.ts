import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import config from "src/config";
import { ErrorResponse } from "src/types/Error";
import { UserToJWT } from "src/utils/jwt";

const post: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).send({
        error: "Invalid username or password type.",
      });
      return;
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (
      user?.passwordHash &&
      (await bcrypt.compare(password, user?.passwordHash))
    ) {
      res.cookie("token", UserToJWT(user), {
        signed: true,
        maxAge: config.TOKEN_EXPIRE,
      });
      res.send();
    } else
      res
        .status(401)
        .send({ error: "Invalid username or password" } as ErrorResponse);
  } catch (err) {
    next(err);
  }
};

export default post;
