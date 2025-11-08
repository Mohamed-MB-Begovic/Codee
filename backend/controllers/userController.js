import User from '../models/User.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users=await User.find({
  createdBy: req.user._id,
  $or: [
    { deletedAt: { $exists: false } },
    { deletedAt: null }
  ]
});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get all users
export const getManagerUsers = async (req, res) => {
  try {
 
    const users = await User.find({ _id: { $ne: req.user._id },status:'active',role:'admin' }); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// get user 
// get me
export const getMe = async (req, res) => {
 
  try {
    const userId = req.user._id // Assuming req.user is set by authentication middleware  
    const user = await User.findById(userId).select('-password');
    // console.log(user)
    if (!user || user===null) return res.status(404).json({ message: 'User not found' });
    // res.json(user);
    if(user.role==='admin'){
      return res.json({
        user:{
 _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      status: user.status,
      type:user.type
        }
      })
    }else
    res.json({
        user: {
        studentId: user.studentId,
        hasVoted: user.hasVoted,
        isAdmin: user.isAdmin,
        role:user.role,
        name:user?.name,
        status:user?.status
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ Create User (Only for School or University Students)
export const createUser = async (req, res) => {
  try {
    const { 
      name, 
      role, 
      class: studentClass, 
      semester, 
      faculty 
    } = req.body;

    // // ✅ Ensure role is student
    // if (role !== 'student') {
    //   return res.status(400).json({ 
    //     message: "Only students can be created with this endpoint." 
    //   });
    // }

    // // ✅ Ensure name is provided
    // if (!name || name.trim() === '') {
    //   return res.status(400).json({ message: "Student name is required." });
    // }

    let userData = {
      name: name.trim(),
      role,
      createdBy: req.user?._id,
    };

    // ✅ Detect type: school or university
    if (studentClass) {
      // 🎒 School Student
      userData.class = studentClass;
      userData.type = 'school';
    } 
    else if (semester && faculty) {
      // 🏫 University Student
      userData.semester = semester;
      userData.faculty = faculty;
      userData.type = 'university';
    } 
    else {
      // ❌ Missing required fields
      return res.status(400).json({ 
        message: "Invalid student data. Provide either 'class' for school students or both 'semester' and 'faculty' for university students." 
      });
    }

    // ✅ Create and save student
    const user = new User(userData);
    await user.save();

    // Remove sensitive data
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(201).json({
      message: 'Student created successfully',
      user: userResponse
    });

  } catch (err) {
    console.error("❌ Error creating student:", err);
    res.status(500).json({ 
      message: "Server error while creating student", 
      error: err.message 
    });
  }
};

// Create user for the manager
export const createAdminUsers = async (req, res) => {
 console.log(req.body)
  try {
    const { role, name, email ,type} = req.body;
 
     const userData = {
        name: req.body.name || '', // Optional for admin
        email: req.body.email,
        role: req.body.role,
        type,
        isAdmin: true
      };
  
 
    const user = new User({...userData,createdBy:req.user._id});
    await user.save();

    // Return user without password
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(201).json({ 
      message: 'User created successfully', 
      user: userResponse 
    });

  } catch (err) {
    // console.log(err)
    res.status(500).send(err)
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
 
  try {
    // Find user by ID
  const user = await User.findByIdAndUpdate(
       req.params.id,
       {deletedAt:new Date()},
       { new: true }
     );
     

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
