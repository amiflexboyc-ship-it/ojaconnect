const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary from environment
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
const isConfigured = Boolean(
  cloudinaryUrl && 
  !cloudinaryUrl.includes('<your_api_key>') && 
  !cloudinaryUrl.includes('<your_api_secret>')
);

if (isConfigured) {
  cloudinary.config({
    secure: true
  });
  console.log('[Cloudinary] Initialized with production credentials.');
} else {
  console.log('[Cloudinary] Note: CLOUDINARY_URL contains placeholder credentials. Local storage fallback will be used until real API keys are provided.');
}

/**
 * Upload an image buffer to Cloudinary with automatic fallback
 * @param {Buffer} fileBuffer - The memory buffer of the uploaded file
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File mimetype
 * @returns {Promise<{ url: string, publicId: string, provider: string }>}
 */
const uploadToCloudinary = async (fileBuffer, originalName = 'product.jpg', mimeType = 'image/jpeg') => {
  if (isConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ojaconnect/products',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]', error);
            // If Cloudinary fails, fallback to local storage
            return resolve(saveToLocal(fileBuffer, originalName, mimeType));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            provider: 'cloudinary',
            format: result.format,
            bytes: result.bytes
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  // Fallback: save to server/uploads/ and serve publicly
  return saveToLocal(fileBuffer, originalName, mimeType);
};

const saveToLocal = (fileBuffer, originalName, mimeType) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = mimeType === 'image/png' ? '.png' : mimeType === 'image/webp' ? '.webp' : '.jpg';
  const filename = 'oja_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8) + ext;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, fileBuffer);
  console.log('[Storage Fallback] Saved image locally to', filePath);

  return {
    url: `/uploads/${filename}`,
    publicId: filename,
    provider: 'local',
    bytes: fileBuffer.length
  };
};

module.exports = { uploadToCloudinary, isCloudinaryConfigured: () => isConfigured };
