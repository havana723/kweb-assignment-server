import { Router } from "express";
import del from "./delete";
import get from "./get";

const router = Router();

router.delete("", del);
router.get("", get);

export default router;
