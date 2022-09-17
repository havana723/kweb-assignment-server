import { Router } from "express";
import get from "./get";
import post from "./post";
import recents from "./recents";

const router = Router();

router.get("/", get);
router.post("/", post);
router.get("/recents", recents);

export default router;
