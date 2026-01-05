import Admin from "../models/Admin.js";
import RefreshToken from "../models/RefreshToken.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import { loginSchema } from "../validations/login.vlidate.js";
import { regSchema } from "../validations/admin.validate.js";
import { newAccessToken, newRefreshToken } from "../utils/functions.js";
import Attendance from "../models/Attendance.js";
// register logic for admin
export const register = async (req, res) => {
  const result = regSchema.safeParse(req.body);
  if (!result.success) {
    const errors = z.flattenError(result.error);
    return res.status(400).json({
      error:
        errors.formErrors.length != 0 ? errors.formErrors : errors.fieldErrors,
    });
  }
  try {
    const { firstname, lastname, email, password, type } = req.body;
    const userExits = await Admin.findOne({ email }).select("-password");
    if (userExits)
      return res.status(400).json({ error: "Email already Exists" });

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 13);
    let newAdmin;
    if (!type) {
      newAdmin = new Admin({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
    } else {
      newAdmin = new Admin({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        type,
      });
    }
    const access_token = newAccessToken(newAdmin);
    const refresh_token = newRefreshToken(newAdmin);
    await newAdmin.save();

    const refreshToken = new RefreshToken({
      token: refresh_token,
      user: newAdmin._id,
    });
    await refreshToken.save();

    return res.status(201).json({
      message: "Admin Registered Successfully",
      admin: newAdmin,
      access_token,
      refresh_token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "A server error occurred" });
  }
};
// login logic for admin
export const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const errors = z.flattenError(result.error);
    return res.status(400).json({
      error:
        errors.formErrors.length != 0 ? errors.formErrors : errors.fieldErrors,
    });
  }
  try {
    const { email, password } = req.body;

    // check for User
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // confirm password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const access_token = newAccessToken(user);
    const refresh_token = newRefreshToken(user);

    // update refresh token
    await RefreshToken.updateOne({ user: user._id }, { token: refresh_token });

    return res.status(201).json({
      message: "User Logged In Successfully",
      user,
      access_token,
      refresh_token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "A server error occurred" });
  }
};
// get all attendance
export const getAttendance = async (req, res) => {
  const user = req.user;
  try {
    const attendanceList = await Attendance.find()
      .populate("user", "firstname lastname matricNumber -_id")
      .select("-_id -updatedAt -createdAt -__v")
      .lean();

    const records = attendanceList.map(({ user, ...rest }) => ({
      ...user,
      ...rest,
    }));

    res.status(200).json({
      message: "Attendance records fetched successfully.",
      records: records,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "A server error occurred" });
  }
};
