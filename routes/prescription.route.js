import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  addPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  downloadPrescription
} from '../controllers/prescription.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const uploadDir = './uploads/prescriptions';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.use((req, res, next) => {
  console.log(`Prescription route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/", protectRoute, upload.single('file'), addPrescription);
router.get("/", protectRoute, getPrescriptions);
router.get("/:id", protectRoute, getPrescriptionById);
router.put("/:id", protectRoute, upload.single('file'), updatePrescription);
router.delete("/:id", protectRoute, deletePrescription);
router.get("/download/:id", protectRoute, downloadPrescription);

export default router;