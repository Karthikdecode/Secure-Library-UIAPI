import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Resize and optimize uploaded images before persisting them.
export const processImage = async (filePath, outputPath) => {
  await sharp(filePath)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(outputPath);

  fs.unlinkSync(filePath);
  return outputPath;
};
