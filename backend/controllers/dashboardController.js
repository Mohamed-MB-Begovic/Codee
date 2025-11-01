 

import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import User from "../models/User.js";
import Vote from "../models/Vote.js";

// for the admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments({user:req.user._id});
    const totalUsers = await User.countDocuments({createdBy:req.user._id});
    const activeElections = await Election.countDocuments({createdBy:req.user._id, status: "active" });
    const totalCandidates = await Candidate.countDocuments({createdBy:req.user._id});

    res.json({
      totalVotes,
      totalUsers,
      activeElections,
      totalCandidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// for the super admin
export const getDashboardStatsForSuperAdmin = async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();
    const totalUsers = await User.countDocuments({_id: { $ne: req.user._id }});
    const activeElections = await Election.countDocuments({status: "active" });
    const totalCandidates = await Candidate.countDocuments();

    res.json({
      totalVotes,
      totalUsers,
      activeElections,
      totalCandidates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

 

 
