// routes/elections.js
import express from 'express';
import {
  getElections,
  getElection,
  createElection,
  updateElection,
  deleteElection,
  startElection,
  endElection,
  publishResults,
  getElectionStats,
  getElectionStatus,
  hideElectionResults
} from '../controllers/electionController.js';
import { admin } from '../middleware/auth.js';
import { Authenticate } from '../middleware/Authenticate.js';
import { getElectionResults } from '../controllers/resultController.js';

const electionRouter = express.Router();

// Public routes
electionRouter.get('/', Authenticate,getElections);
electionRouter.get('/:id', getElection);
electionRouter.get('/:id/stats', getElectionStats);

electionRouter.get('/status', getElectionStatus);
electionRouter.get('/results', getElectionResults);
// Protected admin routes
electionRouter.post('/', Authenticate, admin, createElection);
electionRouter.put('/:id', Authenticate, admin, updateElection);
electionRouter.delete('/:id', Authenticate, admin, deleteElection);
electionRouter.put('/:id/start', Authenticate, admin, startElection);
electionRouter.put('/:id/end', Authenticate, admin, endElection);
electionRouter.put('/:id/publish', Authenticate, admin, publishResults);
electionRouter.put('/:id/hide', Authenticate, admin, hideElectionResults);

export default electionRouter;