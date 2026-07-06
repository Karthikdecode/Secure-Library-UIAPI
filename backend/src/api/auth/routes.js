import { Router } from 'express';
import { registerUser, loginUser } from './controller.js';

const router = Router();

// TODO: Define auth endpoints for registration and login.
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
