import {
  register,
  login,
  getAttendance,
} from "../controller/admin.controller.js";
import { newToken, logout, getMe } from "../controller/auth.controller.js";
import { isAdmin, auth } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/", register);
router.post("/login", login);
router.post("/new-token", isAdmin(process.env.JWT_REFRESH_SECRET), newToken);
router.get("/attendance", isAdmin(), getAttendance);
router.post("/logout", isAdmin(), logout);
router.get("/me", isAdmin(), getMe);

export default router;
