import { regFace, verifyFace } from "../controller/face.controller.js";
import { auth, isAdmin } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/", auth(), regFace);
router.post("/verify-user", verifyFace);

export default router;
