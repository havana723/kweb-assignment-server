import { Router } from "express";
import auth from "./auth";
import course from "./course";

const router = Router();

router.use("/auth", auth);
router.use("/course", course);

export default router;
