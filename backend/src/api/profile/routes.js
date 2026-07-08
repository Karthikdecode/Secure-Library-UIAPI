import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { profileController } from './controller.js';

const router = Router();

router.get('/', authenticate, profileController.getProfile);

export default router;
