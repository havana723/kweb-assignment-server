import { Router } from "express";
import get from "./get";
import my from "./my";

const router = Router();

router.get("", get);
router.get("/my", my);

export default router;
