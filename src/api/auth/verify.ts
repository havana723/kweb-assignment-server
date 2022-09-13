import { RequestHandler } from "express";
import { ErrorResponse } from "src/types/Error";
import UserResponse from "src/types/UserResponse";

const get: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send({
        error: "Unauthorized.",
      } as ErrorResponse);
      return;
    }
    res.send({
      username: req.user.username,
      name: req.user.name,
      uniqueId: req.user.uniqueId,
      role: req.user.role,
    } as UserResponse);
  } catch (err) {
    next(err);
  }
};

export default get;
