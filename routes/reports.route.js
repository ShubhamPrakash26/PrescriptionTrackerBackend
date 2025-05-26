import express from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  addReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
} from "../controllers/report.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const uploadDir = './uploads/reports';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

const router = express.Router();

router.use((req, res, next) => {
  console.log(`Report route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/", protectRoute, upload.single('file'), addReport);
router.get("/", protectRoute, getReports);
router.get("/:id", protectRoute, getReportById);
router.put("/:id", protectRoute, upload.single('file'), updateReport);
router.delete("/:id", protectRoute, deleteReport);

export default router;
