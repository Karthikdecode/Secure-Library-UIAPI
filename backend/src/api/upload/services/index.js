import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { processImage } from '../../../middleware/image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Service layer for handling image upload processing.
export const processUpload = async (file) => {
  const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
  const outputPath = path.join(uploadDir, `${file.filename}.jpg`);

  await processImage(file.path, outputPath);

  return {
    message: 'Image uploaded successfully',
    fileName: path.basename(outputPath),
    mimeType: 'image/jpeg',
    size: fs.statSync(outputPath).size,
  };
};
