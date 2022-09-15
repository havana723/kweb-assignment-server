import { Router } from "express";
import get from "./get";
import list from "./list";
import post from "./post";

const router = Router();

router.get("", get);
router.post("", post);
router.use("/list", list);

export default router;
