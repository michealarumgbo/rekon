import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkInTime: {
      type: String,
    },
    checkOutTime: {
      type: String,
    },
    day: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
