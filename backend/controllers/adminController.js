import User from '../models/User.js';
import Election from '../models/Election.js';
import Candidate from '../models/Candidate.js';
import Vote from '../models/Vote.js';

export const getSystemStatistics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalElections,
      activeElections,
      totalVotes,
      votedUsers
    ] = await Promise.all([
      User.countDocuments({createdBy:req.user._id,status:'active'}),
      Candidate.countDocuments({createdBy:req.user._id}),
      Election.countDocuments({createdBy:req.user._id}),
      Election.countDocuments({createdBy:req.user._id, status: 'active' }),
      Vote.countDocuments({user:req.user._id}),
      User.countDocuments({ createdBy:req.user._id , hasVoted: true })
    ]);

    const participationRate = totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
          students: totalUsers,
          voted: votedUsers,
          notVoted: totalUsers - votedUsers,
          participationRate: parseFloat(participationRate)
        },
        elections: {
          total: totalElections,
          active: activeElections,
          completed: totalElections - activeElections
        },
        votes: {
          total: totalVotes,
          averagePerElection: totalElections > 0 ? (totalVotes / totalElections).toFixed(2) : 0
        },
        candidates: {
          total: totalCandidates,
          averagePerElection: totalElections > 0 ? (totalCandidates / totalElections).toFixed(2) : 0
        }
      },
      server: {
        // processId: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform
      }
    });
  } catch (error) {
    console.error('Get system statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system statistics'
    });
  }
};

// user management
1. // Reset user voting status
export const resetUserVotingStatus = async (req, res) => {
  try {
    const { userId, resetAll } = req.body;

    if (resetAll) {
      // Reset all users' voting status
      const result = await User.updateMany(
        { hasVoted: true },
        { $set: { hasVoted: false } }
      );
      
      return res.json({
        success: true,
        message: `Reset voting status for ${result.modifiedCount} users`,
        resetCount: result.modifiedCount
      });
    }

    if (userId) {
      // Reset specific user
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { hasVoted: false } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        message: `Reset voting status for ${user.name}`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          hasVoted: user.hasVoted
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Either userId or resetAll is required'
    });
  } catch (error) {
    console.error('Reset voting status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting voting status'
    });
  }
};
2. // Get all users with voting status
export const getUsersWithVotingStatus = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const filter = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ]
    };

    const users = await User.find({createdBy:req.user._id})
      .select('name email studentId role hasVoted createdAt ')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    // Get voting statistics
    const votedUsers = await User.countDocuments({ ...filter, hasVoted: true });
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      users,
      statistics: {
        totalUsers,
        votedUsers,
        notVotedUsers: totalUsers - votedUsers,
        participationRate: totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(2) : 0
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

//  deleted users management
// Get soft-deleted users
export const getDeletedUsers = async (req, res) => {
//  console.log('get deleted user')
  try {
    const { search } = req.query;
    const query = { status: 'inactive',deletedAt:{ $ne: null } };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { party: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find({
  createdBy: req.user._id,
  deletedAt: { $exists: true, $ne: null }
})
      // .populate('election', 'title status')
      // .sort({ deletedAt: -1 });

    res.status(200).json({ 
      success: true, 
      users 
    });
  } catch (error) {
    console.error('Error fetching deleted candidates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch deleted candidates',
      error: error.message 
    });
  }
};

// System settings
export const updateSystemSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    // In a real application, you'd save these to a settings collection
    // For now, we'll just return success
    const systemSettings = {
      votingEnabled: settings.votingEnabled ?? true,
      registrationEnabled: settings.registrationEnabled ?? true,
      resultsPublic: settings.resultsPublic ?? false,
      maxVotesPerUser: settings.maxVotesPerUser ?? 1,
      electionTitle: settings.electionTitle ?? 'Student Election',
      electionDescription: settings.electionDescription ?? '',
      maintenanceMode: settings.maintenanceMode ?? false,
      updatedAt: new Date()
    };

    // Here you would save to database, for now we return the settings
    res.json({
      success: true,
      message: 'System settings updated successfully',
      settings: systemSettings
    });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating system settings'
    });
  }
};
// Backup system data
export const backupSystemData = async (req, res) => {
  try {
    const backupData = {
      timestamp: new Date(),
      users: await User.find().select('-password').lean(),
      elections: await Election.find().lean(),
      candidates: await Candidate.find().lean(),
      votes: await Vote.find().lean()
    };

    // In a real application, you'd save this to a file or cloud storage
    // For now, we'll return it as JSON
    res.json({
      success: true,
      message: 'Backup created successfully',
      backup: {
        timestamp: backupData.timestamp,
        data: backupData
      }
    });
  } catch (error) {
    console.error('Backup system data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating backup'
    });
  }
};


// Restore a user
export const restoreUser = async (req, res) => {
// console.log('restore user')
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        deletedAt: null
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'user not found' 
      });
    }

  

    res.status(200).json({ 
      success: true, 
      message: 'user restored successfully',
      user 
    });
  } catch (error) {
    console.error('Error restoring user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restore user',
      error: error.message 
    });
  }
};

// Permanently delete a user
export const permanentlyDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'user not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'user permanently deleted successfully' 
    });
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to permanently delete user',
      error: error.message 
    });
  }
};

// Restore all deleted users
export const restoreAllUsers = async (req, res) => {
  try {
    // Restore all users
    const result = await User.updateMany(
      { status: 'inactive' },
      { 
        status: 'active',
        deletedAt: null
      }
    );

    res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} users restored successfully`,
      restoredCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error restoring all users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restore all users',
      error: error.message 
    });
  }
};

// canditdates
// Get soft-deleted candidates
export const getDeletedCandidates = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { isActive: false };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { party: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ];
    }

    const candidates = await Candidate.find({createdBy:req.user._id,isActive:false})
      .populate('election', 'title status')
      .sort({ deletedAt: -1 });

    res.status(200).json({ 
      success: true, 
      candidates 
    });
  } catch (error) {
    console.error('Error fetching deleted candidates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch deleted candidates',
      error: error.message 
    });
  }
};
// Restore a candidate
export const restoreCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { 
        isActive: true,
        deletedAt: null
      },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }

    // If candidate has an election, update election's candidate count
    if (candidate.election) {
      await Election.findByIdAndUpdate(
        candidate.election,
        { $inc: { totalCandidates: 1 } }
      );
    }

    res.status(200).json({ 
      success: true, 
      message: 'Candidate restored successfully',
      candidate 
    });
  } catch (error) {
    console.error('Error restoring candidate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restore candidate',
      error: error.message 
    });
  }
};
// Permanently delete a candidate
export const permanentlyDeleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findByIdAndDelete(id);
    
    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Candidate permanently deleted successfully' 
    });
  } catch (error) {
    console.error('Error permanently deleting candidate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to permanently delete candidate',
      error: error.message 
    });
  }
};

// Restore all deleted candidates
export const restoreAllCandidates = async (req, res) => {
  try {
    // Find all deleted candidates to get their election IDs
    const deletedCandidates = await Candidate.find({ isActive: false });
    
    // Group by election for batch updates
    const electionUpdates = {};
    deletedCandidates.forEach(candidate => {
      if (candidate.election) {
        electionUpdates[candidate.election] = (electionUpdates[candidate.election] || 0) + 1;
      }
    });

    // Update elections with candidate counts
    const electionUpdatePromises = Object.entries(electionUpdates).map(([electionId, count]) => {
      return Election.findByIdAndUpdate(
        electionId,
        { $inc: { totalCandidates: count } }
      );
    });

    await Promise.all(electionUpdatePromises);

    // Restore all candidates
    const result = await Candidate.updateMany(
      { isActive: false },
      { 
        isActive: true,
        deletedAt: null
      }
    );

    res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} candidates restored successfully`,
      restoredCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error restoring all candidates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restore all candidates',
      error: error.message 
    });
  }
};


// export const getDeletedCandidatesStats = async (req, res) => {
//   try {
//     const totalDeleted = await Candidate.countDocuments({ isActive: false });
    
//     const votesLost = await Candidate.aggregate([
//       { $match: { isActive: false } },
//       { $group: { _id: null, totalVotes: { $sum: '$votes' } } }
//     ]);

//     const oldestDeletion = await Candidate.findOne({ isActive: false })
//       .sort({ deletedAt: 1 })
//       .select('deletedAt');

//     const electionsAffected = await Candidate.distinct('election', { isActive: false });

//     res.status(200).json({
//       success: true,
//       statistics: {
//         totalDeleted,
//         totalVotesLost: votesLost[0]?.totalVotes || 0,
//         oldestDeletion: oldestDeletion?.deletedAt || null,
//         electionsAffected: electionsAffected.length
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching deleted candidates stats:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to fetch deleted candidates statistics',
//       error: error.message 
//     });
//   }
// };