import express from "express";
import {  getDashboardStats, getDashboardStatsForSuperAdmin  } from "../controllers/dashboardController.js";
 import {Authenticate, superAdmin} from '../middleware/Authenticate.js'
import admin from "../middleware/admin.js";

const dashbourdRoutes = express.Router();
dashbourdRoutes.use(Authenticate)
 
//  for the admin
dashbourdRoutes.get("/stats",admin,getDashboardStats);
// for super admin
dashbourdRoutes.get("/dashboard",admin,superAdmin,getDashboardStatsForSuperAdmin);

 


export default dashbourdRoutes;
