import {
  register,
  login,
  deleteUser,
  updatePassword,
  sendVerificationPin,
  verifyEmail,
  newToken,
  logout,
  getMe,
} from "../controller/auth.controller.js";
import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", register);
router.post("/email-pin", auth(), sendVerificationPin);
router.post("/verify-pin", auth(), verifyEmail);
router.post("/login", login);
router.get("/me", auth(), getMe);
router.post("/new-token", auth(process.env.JWT_REFRESH_SECRET), newToken);
router.post("/update-password", auth(), updatePassword);
router.post("/logout", auth(), logout);
router.delete("/me", auth(), deleteUser);

export default router;
