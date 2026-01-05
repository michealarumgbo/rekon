import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auth from "./route/auth.route.js";
import admin from "./route/admin.route.js";
import face from "./route/face.route.js";

dotenv.config();
const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1/admin/", admin);
app.use("/api/v1/auth/", auth);
app.use("/api/v1/face/", face);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Application running on PORT: ${PORT}`);
});
