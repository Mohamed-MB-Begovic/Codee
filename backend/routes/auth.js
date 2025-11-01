// routes/auth.js
import express from 'express';
import { login } from '../controllers/authController.js';
import { admin } from '../middleware/auth.js';
import { Authenticate } from '../middleware/Authenticate.js';

const router = express.Router();

router.post('/login', login);
export default router;