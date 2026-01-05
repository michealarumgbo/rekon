import Face from "../models/Face.js";
import Attendance from "../models/Attendance.js";
import { embeddingsCheck, getEuclideanDist } from "../utils/functions.js";

// register face
export const regFace = async (req, res) => {
  const user = req.user;
  const { embeddings } = req.body;

  try {
    // check embeddings length and if it is array
    if (
      !embeddings ||
      !Array.isArray(embeddings) ||
      embeddings.length !== 128
    ) {
      return res.status(400).json({ error: "Invalid or missing embeddings" });
    }

    // check if user exist
    const userExists = await Face.findOne({ user: user._id });
    if (userExists) {
      userExists.embeddings = embeddings;
      await userExists.save();
      return res.status(200).json({ message: "Face embeddings updated" });
    }

    // if user not found save
    const newFace = new Face({
      user: user._id,
      embeddings,
    });

    await newFace.save();
    return res
      .status(201)
      .json({ message: "Face registered successfully", face: newFace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while saving face data" });
  }
};
// ceck in or check out user
export const verifyFace = async (req, res) => {
  const { embeddings } = req.body;

  try {
    if (
      !embeddings ||
      !Array.isArray(embeddings) ||
      embeddings.length !== 128
    ) {
      return res.status(400).json({ error: "Invalid or missing embeddings" });
    }
    // get all faces
    const faces = await Face.find();

    const possibleFaces = faces.filter((face) => {
      const embeddingsMatch = embeddingsCheck(
        embeddings,
        face.embeddings,
        0.35
      );
      if (embeddingsMatch) {
        return face;
      }
    });

    if (possibleFaces.length == 0) {
      return res.status(404).json({
        error: "Face not found",
      });
    }

    let faceDist = [];
    possibleFaces.forEach((element) => {
      faceDist.push({
        face: element,
        dist: getEuclideanDist(embeddings, element.embeddings),
      });
    });

    let closetFace;
    let minDist = Infinity;
    faceDist.forEach((item) => {
      if (item.dist < minDist) {
        (minDist = item.dist), (closetFace = item.face);
      }
    });

    const date = new Date();
    const formatted = date.toLocaleDateString("en-CA");
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const attendance = await Attendance.findOne({
      user: closetFace.user,
      day: formatted,
    });

    if (attendance) {
      // Check-in
      if (!attendance.checkInTime) {
        attendance.checkInTime = time;
        await attendance.save();
        return res.status(200).json({
          face: closetFace,
          success: true,
          message: "Face Match Confirmed, Checked In",
        });
      }

      // Check-out (only once)
      if (!attendance.checkOutTime) {
        attendance.checkOutTime = time;
        await attendance.save();
        return res.status(200).json({
          face: closetFace,
          success: true,
          message: "Face Match Confirmed, Checked Out",
        });
      }
      return res.status(200).json({
        message: "Face Match Confirmed, Already Checked Out",
      });
    }

    const newAttendance = new Attendance({
      user: closetFace.user,
      checkInTime: time,
      checkOutTime: null,
      day: formatted,
    });

    await newAttendance.save();
    return res.status(200).json({
      face: closetFace,
      success: true,
      message: "Face Match Confirmed, Checked In",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while verifying face data" });
  }
};
