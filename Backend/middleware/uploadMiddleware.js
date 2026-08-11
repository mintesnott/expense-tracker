import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';


// Ensure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Configure storage destination & filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Saves files into /uploads folder
  },
  filename: (req, file, cb) => {
    // Generate unique filename: fieldname-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// 2. File filter (allow images only)
 const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }

  const error = new Error('Only image files (jpg, jpeg, png, webp) are allowed!');
  error.statusCode = StatusCodes.BAD_REQUEST;
  cb(error, false);
};

// 3. Initialize Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
});

export default upload;