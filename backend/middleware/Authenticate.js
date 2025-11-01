import jwt from "jsonwebtoken";
import { JWT_SECRET  } from "../config/config.js";
export const Authenticate = (req, res, next) => {
  const token = req.cookies.token ;

  if (!token) return res.status(403).send("Anuthorized access please login");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // console.log(req.user)
    next();
  } catch (error) {
    console.log(error);
  }
};

// middleware/admin.js
export const superAdmin = (req, res, next) => {
 
  if (req.user.role==='superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin required.' });
  }
};

