// routes/candidates.js
import express from 'express';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate
} from '../controllers/candidateController.js';
import upload  from '../config/multer.js';
import {admin } from '../middleware/auth.js';
import {Authenticate} from '../middleware/Authenticate.js'
const router = express.Router();

// Protected admin routes
router.post('/:id', Authenticate, admin, upload.single('thumbnail'), createCandidate);
router.put('/:id', Authenticate, admin, upload.single('thumbnail'),updateCandidate);

// Public routes
router.get('/', Authenticate,getCandidates);
router.delete('/:id', Authenticate, admin, deleteCandidate);

export default router;