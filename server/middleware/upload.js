const multer = require('multer');

// Configure memory storage to process image buffer directly for Cloudinary streaming
const storage = multer.memoryStorage();

// Allowed MIME types strictly for image files
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB Upload Limit

// File filter validation
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file format. Only JPEG, PNG, and WEBP image files are allowed.');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB max
    files: 1 // Only 1 product photo at a time
  },
  fileFilter: fileFilter
});

// Wrapper middleware to format Multer errors cleanly
const uploadProductImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size too large',
          message: 'The selected image exceeds the 5MB upload limit. Please upload a smaller image.'
        });
      }
      if (err.code === 'INVALID_FILE_TYPE' || err.message.includes('Invalid file format')) {
        return res.status(400).json({
          success: false,
          error: 'Unsupported image type',
          message: err.message || 'Only JPEG, PNG, and WEBP image files are accepted.'
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Upload error',
        message: err.message || 'Failed to process product image.'
      });
    }
    next();
  });
};

module.exports = { uploadProductImage, MAX_FILE_SIZE, ALLOWED_MIME_TYPES };
