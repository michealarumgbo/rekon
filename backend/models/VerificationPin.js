import mongoose, { Schema } from "mongoose";

const verificationPinSchema = new Schema({
  pin: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 6,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "10m",
  },
});

const VerificationPin = mongoose.model(
  "VerificationPin",
  verificationPinSchema
);

export default VerificationPin;
