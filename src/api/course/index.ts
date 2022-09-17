import { Router } from "express";
import get from "./get";
import list from "./list";
import post from "./post";
import register from "./register";
import student from "./student";

const router = Router();

router.get("/", get);
router.post("/", post);
router.use("/list", list);
router.use("/register", register);
router.use("/student", student);

export default router;
