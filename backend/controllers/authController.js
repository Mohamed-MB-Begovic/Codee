// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/config.js';

const generateToken = (userId) => {
  // return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
  

};
export const login = async (req, res) => {
  try {
    const { studentId, email, password } = req.body;

    // Validate input - check if either studentId or email is provided
    if ((!studentId && !email) || !password) {
      return res.status(400).json({ 
        message: 'Student ID/Email and password are required' 
      });
    }

    // Build query based on provided identifier
    let query;
    if (studentId) {
      query = { studentId: studentId.toUpperCase() };
    } else {
      query = { email: email.toLowerCase() };
    }

    // Find user
    const user = await User.findOne(query);
    if (!user) {
      const identifier = studentId ? 'Student ID' : 'Email';
      return res.status(401).json({ 
        message: `Invalid ${identifier}` 
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({ 
        message: 'Account is inactive. Please contact administration.' 
      });
    }

    // Check password
    const isMatch = user.password === password;
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
    const token = jwt.sign({
      _id: user._id,
      isAdmin: user.isAdmin,
      hasVoted: user.hasVoted,
      studentId: user.studentId,
      email: user.email,
      role: user.role,
      status:user.status,
    }, JWT_SECRET, {
      expiresIn
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: expiresIn * 1000, // 7 days
      path: '/'
    });

    // Prepare user response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      status: user.status,
      type:user.type
    };

    // Add student-specific fields only if user is a student
    if (user.role === 'student' || user.studentId) {
      userResponse.studentId = user.studentId;
      userResponse.class = user.class;
      userResponse.hasVoted=user.hasVoted
    }

    res.json({
      token,
      user: userResponse,
      expiresIn,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
