const multer = require('multer');
const path = require('path');

// -----------------------------------------------
// Allowed file types
// -----------------------------------------------
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// -----------------------------------------------
// Storage config - save to uploads/ folder
// -----------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Make unique filename: timestamp + original name
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// -----------------------------------------------
// File filter - only allow jpg, png, gif
// -----------------------------------------------
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF are allowed.'), false);
  }
};

// -----------------------------------------------
// Final multer config
// -----------------------------------------------
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

module.exports = upload;
