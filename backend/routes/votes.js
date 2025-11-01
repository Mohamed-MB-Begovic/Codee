// routes/votes.js
import express from 'express';
// import {auth} from '../middleware/auth.js';
import { submitVote, getResults, getCandidates, } from '../controllers/voteController.js';
import { Authenticate } from '../middleware/Authenticate.js';
import { getUser } from '../middleware/getUserAdmin.js';
// import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', Authenticate,getUser,getCandidates);
// router.get('/status', getElectionStatus);
router.post('/', Authenticate, submitVote);
router.get('/results', getResults);

export default router;