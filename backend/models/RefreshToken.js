import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;
