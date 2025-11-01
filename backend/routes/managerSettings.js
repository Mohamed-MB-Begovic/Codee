import express from 'express';
import {Authenticate, superAdmin} from '../middleware/Authenticate.js';
import { deleteAllCandidates, deleteAllElections, deleteAllUsers, deleteAllVotes, deleteEverything, getDeletedUsers, getSystemStatistics, permanentlyDeleteUser, restoreAllUsers, restoreUser } from '../controllers/managerSettingsController.js';

const managerSettingsRouter=express.Router();
managerSettingsRouter.use(Authenticate);
managerSettingsRouter.use(superAdmin);
 
managerSettingsRouter.get('/statistics',getSystemStatistics);
managerSettingsRouter.get('/users/deleted',getDeletedUsers);
managerSettingsRouter.put('/users/:id/restore', restoreUser);
managerSettingsRouter.delete('/users/:id/permanent', permanentlyDeleteUser);
managerSettingsRouter.put('/users/restore-all', restoreAllUsers);
managerSettingsRouter.delete("/users",deleteAllUsers);
managerSettingsRouter.delete("/candidates",deleteAllCandidates);
managerSettingsRouter.delete("/elections",deleteAllElections);
managerSettingsRouter.delete("/votes",deleteAllVotes);
managerSettingsRouter.delete("/everything",deleteEverything);
export default managerSettingsRouter;