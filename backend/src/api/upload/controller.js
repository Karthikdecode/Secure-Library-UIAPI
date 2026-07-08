import { uploadFileHandler, listFilesHandler } from './handlers/index.js';

// Controller layer for upload requests.
export const uploadController = {
  uploadFile: async (req, res, next) => {
    try {
      await uploadFileHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  listFiles: async (req, res, next) => {
    try {
      await listFilesHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  },
};
