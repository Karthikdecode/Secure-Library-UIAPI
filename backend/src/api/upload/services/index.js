import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { processImage } from '../../../middleware/image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');

const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

// Service layer for handling image upload processing.
export const processUpload = async (file) => {
  ensureUploadDir();
  const outputPath = path.join(uploadDir, `${file.filename}.jpg`);

  await processImage(file.path, outputPath);

  return {
    message: 'Image uploaded successfully',
    fileName: path.basename(outputPath),
    mimeType: 'image/jpeg',
    size: fs.statSync(outputPath).size,
  };
};

export const listUploads = async () => {
  ensureUploadDir();
  const files = fs.readdirSync(uploadDir).filter((file) => file !== '.gitkeep');
  return files.map((file) => {
    const filePath = path.join(uploadDir, file);
    const stats = fs.statSync(filePath);
    return {
      fileName: file,
      size: stats.size,
      createdAt: stats.birthtime.toISOString(),
    };
  });
};
