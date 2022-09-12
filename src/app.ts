import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import api from "./api";
import config from "./config";
import auth from "./middlewares/auth";
import { app } from "./server";

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser(config.COOKIE_SECRET));
app.use(
  express.json({
    limit: config.BODY_PARSER_LIMIT,
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(auth);
app.use("/api", api);

app.listen(config.PORT || 3001, () => {
  console.log(`app listening`);
});
