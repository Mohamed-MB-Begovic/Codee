import express from 'express';
import {
  resetUserVotingStatus,
  getUsersWithVotingStatus,
 
  updateSystemSettings,
  
  backupSystemData,
  getDeletedCandidates,
  restoreCandidate,
  permanentlyDeleteCandidate,
  restoreAllCandidates,
 
  restoreUser,
  permanentlyDeleteUser,
  restoreAllUsers,
  getSystemStatistics,
  getDeletedUsers
} from '../controllers/adminController.js';
import { Authenticate } from '../middleware/Authenticate.js';
import admin from '../middleware/admin.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

const settingsRouter = express.Router();

// All routes are protected and require admin role
settingsRouter.use(Authenticate);
settingsRouter.use(admin);

settingsRouter.get('/statistics', getSystemStatistics)

// User management
settingsRouter.get('/users/deleted', getDeletedUsers);
settingsRouter.get('/users', getUsersWithVotingStatus);  //using
settingsRouter.post('/users/reset-votes', resetUserVotingStatus);
settingsRouter.put('/users/:id/restore', restoreUser);
settingsRouter.delete('/users/:id/permanent', permanentlyDeleteUser);
settingsRouter.put('/users/restore-all', restoreAllUsers);

// deleted users management


 
// System settings
settingsRouter.post('/settings', updateSystemSettings); 
settingsRouter.get('/backup', backupSystemData);

// Deleted Candidates Management Routes
settingsRouter.get('/candidates/deleted',getDeletedCandidates);
settingsRouter.put('/candidates/:id/restore', restoreCandidate);
settingsRouter.delete('/candidates/:id/permanent', permanentlyDeleteCandidate);
settingsRouter.put('/candidates/restore-all', restoreAllCandidates);
// settingsRouter.get('/candidates/deleted/stats', getDeletedCandidatesStats);
export default settingsRouter;