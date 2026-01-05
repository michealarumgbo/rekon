import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function newAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );
}
export function newRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}
export const embeddingsCheck = (a = [], b = [], tolerance = 0.01) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
    return false;
  // compute Euclidean distance
  const distance = Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );

  // smaller distance → more similar faces
  return distance < tolerance;
};
export const getEuclideanDist = (a = [], b = []) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
    return false;
  // compute Euclidean distance
  const distance = Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );

  return distance;
};
