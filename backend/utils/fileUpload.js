import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = './uploads/profilePictures';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename using student ID (if available) and timestamp
    const uniqueSuffix = req.params.id ? req.params.id : Date.now();
    cb(null, `student-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure upload limits
const limits = {
  fileSize: 1024 * 1024 * 5 // 5MB max file size
};

// Export configured multer middleware
const upload = multer({ 
  storage, 
  fileFilter,
  limits 
});

export default upload;