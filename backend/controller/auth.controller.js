import { regSchema } from "../validations/register.validate.js";
import { loginSchema } from "../validations/login.vlidate.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Face from "../models/Face.js";
import VerificationPin from "../models/VerificationPin.js";
import { z } from "zod";
import { newAccessToken, newRefreshToken } from "../utils/functions.js";
import { generateRef } from "../utils/generateRef.js";
import bcrypt from "bcrypt";
import mailer from "../utils/mailer.js";
import RefreshToken from "../models/RefreshToken.js";

// register logic
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
    const { firstname, lastname, matricNumber, email, department, password } =
      req.body;

    // check if user exitss already
    const userExits = await User.findOne({ email }).select("-password");
    if (userExits)
      return res.status(400).json({ error: "Email already Exists" });
    // check if matric number exists
    const matricExits = await User.findOne({ matricNumber }).select(
      "-password"
    );
    if (matricExits)
      return res.status(400).json({ error: "Matric Number already Exists" });

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 13);

    const user = new User({
      firstname,
      lastname,
      email,
      matricNumber,
      department,
      password: hashedPassword,
    });
    const access_token = newAccessToken(user);
    const refresh_token = newRefreshToken(user);

    await user.save();

    const refreshToken = new RefreshToken({
      token: refresh_token,
      user: user._id,
    });

    await refreshToken.save();

    return res.status(201).json({
      message: "User Registered Successfully",
      user,
      access_token,
      refresh_token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "A server error occurred" });
  }
};
// Send and Resend Verification Pin  Logic
export const sendVerificationPin = async (req, res) => {
  const user = req.user;
  try {
    const name = `${user.firstname + " " + user.lastname}`.trim();
    const expires_in = "10";
    const code = generateRef(6);

    // delete old ones
    await VerificationPin.deleteMany({ user: user._id });

    // store in db
    const verificationPin = new VerificationPin({
      pin: code,
      user: user._id,
    });
    await verificationPin.save();

    await mailer(
      user.email,
      "Email Verification Code",
      verificationPin.pin,
      name,
      expires_in
    );

    return res.status(200).json({
      message: "Code has been sent to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "A server error occurred" });
  }
};
// verify email
export const verifyEmail = async (req, res) => {
  const user = req.user;
  try {
    const { pin } = req.body;

    if (user.email_verified_at) {
      return res.status(200).json({ message: "Email already verified" });
    }

    // validate pin
    if (!pin || pin.length < 6 || pin.length > 6) {
      return res.status(400).json({ error: "Incorrect Pin Syntax" });
    }

    // validate pin
    const isPin = await VerificationPin.findOne({ pin, user: user._id });
    if (!isPin) {
      return res.status(400).json({ error: "Incorrect Pin" });
    }

    await User.updateOne({ _id: user._id }, { email_verified_at: new Date() });

    await VerificationPin.deleteOne({ user: user._id });

    return res.status(200).json({
      message: "Email Verified Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "A server error occurred" });
  }
};
// login logic
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
    const user = await User.findOne({ email });

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
// new token logic
export const newToken = async (req, res) => {
  const user = req.user;
  try {
    // check if user logged out
    const loggedOut = await RefreshToken.findOne({ user: user._id });
    if (loggedOut.token == "")
      return res.status(400).json({ error: "User already Logged out" });

    // generate token
    const token = newAccessToken(user);

    return res.status(200).json({ access_token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "A server error occurred",
    });
  }
};
// get all attendance
export const updatePassword = async (req, res) => {
  const user = req.user;
  try {
    const { currentPasssword, newPassword } = req.body;
    if (
      !currentPasssword ||
      !newPassword ||
      currentPasssword.trim() == "" ||
      newPassword.trim() == ""
    ) {
      return res.status(400).json({
        error: "All fields must be filled",
      });
    }
    if (currentPasssword == newPassword) {
      return res.status(400).json({
        error: "Passwords must be Different",
      });
    }
    const userPassword = await User.findOne({ email: user.email }).select(
      "password"
    );
    const passwordMatch = await bcrypt.compare(
      currentPasssword,
      userPassword.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        error: "Invalid Password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 13);

    await User.updateOne(
      { email: user.email },
      { password: hashedNewPassword }
    );

    return res.status(200).json({ message: "Password Updated Successfulll" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "A sever error  occurred",
    });
  }
};
// delete profile logic
export const deleteUser = async (req, res) => {
  const user = req.user;
  try {
    // delete user-related records
    await RefreshToken.deleteMany({ user: user._id });
    await Attendance.deleteMany({ user: user._id });
    await Face.deleteMany({ user: user._id });

    // delete actual user account
    await User.deleteOne({ _id: user._id });

    return res.status(200).json({ message: "User Deleted Successfulll" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "A sever error  occurred",
    });
  }
};
// logout logic
export const logout = async (req, res) => {
  const user = req.user;

  try {
    await RefreshToken.updateOne({ user: user._id }, { token: "" });

    return res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "A server error  occurred",
    });
  }
};
export const getMe = async (req, res) => {
  const user = req.user;
  return res.status(200).json({ user });
};
