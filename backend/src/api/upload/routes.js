import { Router } from 'express';
import { uploadController } from './controller.js';
import { upload } from '../../middleware/upload.js';
import { protect } from '../../middleware/auth.js';

const router = Router();

// Upload endpoint remains the same contract while using multer and sharp internally.
router.post('/', protect, upload.single('image'), uploadController.uploadFile);

export default router;
