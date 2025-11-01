import User from '../models/User.js';
import Candidate from '../models/Candidate.js';
import Election from '../models/Election.js';
import Vote from '../models/Vote.js';
// Get system statistics
export const getSystemStatistics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalElections,  
      totalVotes,
    ] = await Promise.all([
      User.countDocuments( ),
      Candidate.countDocuments( ),
      Election.countDocuments( ),
      Vote.countDocuments( ),
 
    ]);

     
    res.json({
      success: true,
      statistics: {
        users: {
          total: totalUsers === 1 ? totalUsers -1 :totalUsers,
 },
        elections: {
          total: totalElections,
        },
        votes: {
          total: totalVotes,
        },
        candidates: {
          total: totalCandidates,
      },
    
    }});
  } catch (error) {
    console.error('Get system statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system statistics'
    });
  }
};


// Get soft-deleted users
export const getDeletedUsers = async (req, res) => {
 
  try {
    const { search } = req.query;
    const query = { status: 'inactive' };
    
    const users = await User.find({createdBy:req.user._id,status:'inactive'})
 
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
// Restore a user
export const restoreUser = async (req, res) => {
// console.log('restore user')
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { 
        status: 'active',
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
      { status: 'inactive' ,role:'admin'},
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

export const deleteAllUsers = async (req, res) => {
  console.log(req.user._id)
  try {
    const currentUserId = req.user._id;  
    console.log(currentUserId)
    // Count users before deletion
    const totalUsers = await User.countDocuments();
    const usersToDelete = totalUsers - 1; // Exclude current user

    if (usersToDelete <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No users to delete'
      });
    }

    // Delete all users except the current admin
    const result = await User.deleteMany({ 
      _id: { $ne: currentUserId } 
    });

 

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} users`,
      deletedCount: result.deletedCount,
      retainedAdmin: true
    });

  } catch (error) {
    console.error('Error deleting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting users'
    });
  }
};
export const deleteAllCandidates = async (req, res) => {
  try {
    // Count candidates before deletion
    const totalCandidates = await Candidate.countDocuments();

    if (totalCandidates === 0) {
      return res.status(400).json({
        success: false,
        message: 'No candidates to delete'
      });
    }

    // Remove candidates from elections first
    await Election.updateMany(
      {},
      { $set: { candidates: [] } }
    );

    // Delete all candidates
    const result = await Candidate.deleteMany({});

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} candidates`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting all candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting candidates'
    });
  }
};
export const deleteAllElections = async (req, res) => {
  try {
    // Count elections before deletion
    const totalElections = await Election.countDocuments();

    if (totalElections === 0) {
      return res.status(400).json({
        success: false,
        message: 'No elections to delete'
      });
    }

    // Delete all elections
    const result = await Election.deleteMany({});

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} elections`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting all elections:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting elections'
    });
  }
};
export const deleteAllVotes = async (req, res) => {
  try {
    // Count votes before deletion
    const totalVotes = await Vote.countDocuments();

    if (totalVotes === 0) {
      return res.status(400).json({
        success: false,
        message: 'No votes to delete'
      });
    }

    // Delete all votes
    const result = await Vote.deleteMany({});

    // Reset voting status for all users
    await User.updateMany({}, { hasVoted: false });

    // Reset vote counts for all candidates
    await Candidate.updateMany({}, { votes: 0 });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} votes`,
      deletedCount: result.deletedCount,
      resetUserVoting: true,
      resetCandidateVotes: true
    });

  } catch (error) {
    console.error('Error deleting all votes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting votes'
    });
  }
};
export const deleteEverything = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Perform all deletions
    const [usersResult, candidatesResult, electionsResult, votesResult] = await Promise.all([
      User.deleteMany({ _id: { $ne: currentUserId } }),
      Candidate.deleteMany({}),
      Election.deleteMany({}),
      Vote.deleteMany({})
    ]);

    // Reset current admin's voting status
    await User.findByIdAndUpdate(currentUserId, { 
      hasVoted: false 
    });

    res.json({
      success: true,
      message: 'All data has been deleted successfully',
      summary: {
        usersDeleted: usersResult.deletedCount,
        candidatesDeleted: candidatesResult.deletedCount,
        electionsDeleted: electionsResult.deletedCount,
        votesDeleted: votesResult.deletedCount,
        adminRetained: true
      }
    });

  } catch (error) {
    console.error('Error deleting everything:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting all data'
    });
  }
};
