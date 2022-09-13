import { Router } from "express";
import post from "./post";

const router = Router();

router.post("/post", post);

export default router;
