import { Router } from 'express';
import { uploadController } from './controller.js';
import { upload } from '../../middleware/upload.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Upload endpoints for authenticated users.
router.post('/', authenticate, upload.single('image'), uploadController.uploadFile);
router.get('/', authenticate, uploadController.listFiles);

export default router;
