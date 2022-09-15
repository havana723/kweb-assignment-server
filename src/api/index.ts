import { Router } from "express";
import auth from "./auth";
import course from "./course";
import lecture from "./lecture";

const router = Router();

router.use("/auth", auth);
router.use("/course", course);
router.use("/lecture", lecture);

export default router;
