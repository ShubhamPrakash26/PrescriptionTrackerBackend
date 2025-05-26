import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prescriptions', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
    public_id: (req, file) => `prescription-${Date.now()}-${file.originalname}`,
  }
});


const upload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export const uploadPrescriptionImage = upload.single('image');
