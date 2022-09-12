import { Router } from "express";
import login from "./login";
import register from "./register";
import verify from "./verify";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify", verify);

export default router;
