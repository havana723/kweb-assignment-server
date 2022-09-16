import { Router } from "express";
import get from "./get";
import list from "./list";
import post from "./post";
import register from "./register";

const router = Router();

router.get("", get);
router.post("", post);
router.use("/list", list);
router.use("/register", register);

export default router;
