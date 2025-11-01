import express from 'express';
const resultRouter = express.Router();
import  {
  getLatestElectionResults,
  getAllElectionResults,
  publishElectionResults
} from '../controllers/resultController.js';
import { Authenticate } from '../middleware/Authenticate.js';
import { getUser } from '../middleware/getUserAdmin.js';
// const { protect, authorize } = require('../middleware/auth');

// Public routes
resultRouter.get('/', Authenticate,getUser,getLatestElectionResults);
resultRouter.get('/results', getAllElectionResults);

// Admin routes
resultRouter.patch('/results/:electionId/publish', Authenticate, publishElectionResults);


export default resultRouter;