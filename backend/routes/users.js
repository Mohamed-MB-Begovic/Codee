import express from 'express';
import { createUser, deleteUser, getUsers, getMe,updateUser, getManagerUsers, createAdminUsers } from '../controllers/userController.js';
import { Authenticate, superAdmin } from '../middleware/Authenticate.js';
import admin from '../middleware/admin.js'
// import  userController from '../controllers/userController.js';

const   router = express.Router();
// Get all users
router.get('/', Authenticate,getUsers);

// Create new user
router.post('/', Authenticate,admin,createUser);

// Update user
router.put('/:id', Authenticate,updateUser);

// Delete user
router.delete('/:id', deleteUser);


router.get('/me',Authenticate,getMe)
// router.get('/live',getMe)
// router for the manager
router.get('/manager/users',Authenticate,admin,superAdmin,getManagerUsers)
router.post('/manager',Authenticate,superAdmin,createAdminUsers);
export default router;