// controllers/electionController.js
// import Election from '../models/Election.js';
// import Candidate from '../models/Candidate.js';
// import Vote from '../models/Vote.js';

import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import Vote from "../models/Vote.js";

// Get all elections with filters
export const getElections = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const elections = await Election.find({createdBy:req.user._id})
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');

    const total = await Election.countDocuments(filter);

    res.json({
      elections,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single election
export const getElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new election
export const createElection = async (req, res) => {
 
  try {
    const { title, description, startDate, endDate } = req.body;
// console.log(req.body)
    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check for overlapping elections
    const overlappingElection = await Election.findOne({
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
          status: { $in: ['active', 'upcoming']},
          createdBy: req.user._id,
        }
      ]
    });

    if (overlappingElection) {
      return res.status(400).json({ 
        message: 'Another election is scheduled during this time period' 
      });
    }

    const election = new Election({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user._id
    });

    // console.log(election)
    await election.save();
    
    // Populate createdBy field for response
    await election.populate('createdBy', 'name email');
    
    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update election
export const updateElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const electionId = req.params.id;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Prevent updating active or completed elections
    if (election.status !== 'upcoming') {
      return res.status(400).json({ 
        message: 'Cannot update active or completed elections' 
      });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const updatedElection = await Election.findByIdAndUpdate(
      electionId,
      { title, description, startDate, endDate },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json(updatedElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete election
export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Prevent deleting active elections
    if (election.status === 'active') {
      return res.status(400).json({ 
        message: 'Cannot delete active election' 
      });
    }

    // Delete associated candidates and votes
    await Candidate.deleteMany({ election: election._id });
    await Vote.deleteMany({ electionId: election._id });
    await Election.findByIdAndDelete(req.params.id);

    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Start election
export const startElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    // console.log(election)
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'upcoming') {
      return res.status(400).json({ 
        message: 'Only upcoming elections can be started' 
      });
    }
    // check if onther election is active
    const activeElection = await Election.findOne({ 
      createdBy:req.user._id,status: 'active' 
    }); 
    if (activeElection) {
      return res.status(400).json({ 
        message: 'Another election is already active' 
      });
    }


    // Check if there are candidates
    const candidateCount = await Candidate.countDocuments({ 
      election: election._id 
    });
    
    if (candidateCount === 0) {
      return res.status(400).json({ 
        message: 'Cannot start election without candidates' 
      });
    }
    // Check if the candidates lessthan 3 candidates

    if (candidateCount < 3) {
      return res.status(400).json({ 
        message: 'Cannot start election with lessthan 3 candidates' 
      });
    }
const now = new Date();
const startDate = new Date(election.startDate);

// Compare only the date parts (ignore time)
const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

if (startDateOnly > nowDateOnly) {
  return res.status(400).json({ 
    message: `Cannot start election before its scheduled start date (${startDate})` 
  });
}
      const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active',
        isActive: true,
        startDate: new Date() // Optionally update start date to now
      },
      { new: true }
    ).populate('createdBy', 'name email');

    res.json(updatedElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// End election
export const endElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'active') {
      return res.status(400).json({ 
        message: 'Only active elections can be ended' 
      });
    }
    // check if election has at least one vote
    const voteCount = await Vote.countDocuments({ 
      electionId: election._id  
    });
    if (voteCount === 0) {
      return res.status(400).json({ 
        message: 'Cannot end election without any votes cast' 
      });
    }

    const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'completed',
        isActive: false,
        endDate: new Date() // Optionally update end date to now
      },
      { new: true }
    ).populate('createdBy', 'name email');

    res.json(updatedElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Publish results
export const publishResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Only completed elections can have results published' 
      });
    }
    // check other election is publsihed
    const otherPublished = await Election.findOne({ 
      createdBy:req.user._id,
      resultsPublished: true,
      _id: { $ne: election._id }  
    });
    if (otherPublished) {
      return res.status(400).json({ 
        message: 'Another election results are already published' 
      });
    }

    const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      { resultsPublished: true },
      { new: true }
    ).populate('createdBy', 'name email');

    res.json(updatedElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get election statistics
export const getElectionStats = async (req, res) => {
  try {
    const electionId = req.params.id;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const candidateCount = await Candidate.countDocuments({ election: electionId });
    const voteCount = await Vote.countDocuments({ election: electionId });
    
    // Get total voters (students)
    const totalVoters = await User.countDocuments({ 
      role: 'student',
      isActive: true 
    });

    const stats = {
      totalCandidates: candidateCount,
      totalVotes: voteCount,
      totalVoters: totalVoters,
      participationRate: totalVoters > 0 ? ((voteCount / totalVoters) * 100).toFixed(2) : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getElectionStatus = async (req, res) => {
  try {
    // Get the latest election
    const election = await Election.findOne().sort({ createdAt: -1 });
    
    if (!election) {
      return res.json({
        status: 'no_election',
        message: 'No election scheduled',
        success: true
      });
    }

    res.json({
      status: election.status,
      name: election.name,
      startDate: election.startDate,
      endDate: election.endDate,
      message: getElectionStatusMessage(election.status),
      success: true
    });
  } catch (error) {
    console.error('Get election status error:', error);
    console.log(error)
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
    //   error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to get status messages
const getElectionStatusMessage = (status) => {
  const messages = {
    active: 'Election is currently active. You can cast your vote.',
    completed: 'Election has ended. Thank you for participating.',
    not_started: 'Election has not started yet. Please check back later.',
    cancelled: 'Election has been cancelled.',
    no_election: 'No election is currently scheduled.'
  };
  return messages[status] || 'Election status unknown.';
};


// hide election result by making  publish result false
export const hideElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    if (election.status !== 'completed') {
      return res.status(400).json({
        message: 'Only completed elections can have results hidden'
      });
    }
    const updatedElection = await Election.findByIdAndUpdate(
      req.params.id,
      { resultsPublished: false },
      { new: true }
    ).populate('createdBy', 'name email');
    res.json(updatedElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
