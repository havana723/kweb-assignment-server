import { RequestHandler } from "express";

const post: RequestHandler = async (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
};

export default post;
