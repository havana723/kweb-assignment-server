import { RequestHandler } from "express";

const post: RequestHandler = async (req, res) => {
  res.clearCookie("token");
  res.sendStatus(201);
};

export default post;
