import { uploadFileHandler } from './handlers/index.js';

// Controller layer for upload requests.
export const uploadController = {
  uploadFile: async (req, res, next) => {
    try {
      await uploadFileHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  },
};
