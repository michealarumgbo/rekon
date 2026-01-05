import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectURI = process.env.MONGOOSE_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(connectURI);
    console.log("DB connection successful");
  } catch (error) {
    console.log("DB Connection Error: " + error);
  }
};

export default connectDB;
