import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import memberRoutes from "./routes/members.route.js";
import prescriptionRoutes from "./routes/prescription.route.js";
import reportRoutes from "./routes/reports.route.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  "http://vipasyanadoc-001-site18.ktempurl.com",         // prod
  "http://localhost:3000",                   
  "http://localhost:5173",           // dev
];

// Enable CORS
app.use(
  cors({
  origin: allowedOrigins,
  credentials: true
})
);

// Enable JSON parsing and cookies
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Serve uploaded files statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/family", memberRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/reports", reportRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  } catch (error) {
    console.error("Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
