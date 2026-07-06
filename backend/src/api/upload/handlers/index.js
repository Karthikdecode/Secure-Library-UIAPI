import { processUpload } from '../services/index.js';

// Handler layer for image upload flow.
export const uploadFileHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const result = await processUpload(req.file);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Upload failed.' });
  }
};
