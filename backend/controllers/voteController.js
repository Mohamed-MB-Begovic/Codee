// controllers/voteController.js
import Vote from '../models/Vote.js';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Election from '../models/Election.js';

export const submitVote = async (req, res) => {
  // console.log(req.user)
  // 
      const { candidateId } = req.body;
    const {electionId}=req.body;
    const {user}=req.body
    const userId = req.user._id;

  try {


    // // Check if user has already voted
    if (req.user.hasVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }
    // // Check if user is admin
    if (req.user.isAdmin) {
      return res.status(400).json({ message: 'You cannot vote' });
    }

    // // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || !candidate.isActive) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // // Record vote
    const vote = new Vote({
      studentId: req.user.studentId,
      user,
      candidateId,
      ipAddress: req.ip,
      electionId: electionId,
    });

    // check if the user has already voted in this election
    const election=await Election.findOne({_id:electionId})
    const existingVote = await election.voters.includes(userId);
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }
    // const existingVote = await Vote.findOne({ user:user, studentId: req.user.studentId, electionId: electionId });
    // if (existingVote) {
    //   return res.status(400).json({ message: 'You have already voted in this election' });
    // } 

    // console.log(vote)
    // console.log(req.user.studentId)
    await vote.save();

    // Update candidate vote count
    candidate.votes += 1;
    await candidate.save();
    // update election total votes
    await Election.findOneAndUpdate(
      { candidates: candidateId, status: 'active' },
      { $inc: { totalVotes: 1 ,totalVoters: 1}, $push:{voters:userId}} 
    );
    // Mark user as voted
    await User.findByIdAndUpdate(userId, { hasVoted: true });

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
export const getCandidates = async (req, res) => {
  // console.log(req.user)
  try {
    const { page = 1, limit = 10, party, sortBy = 'name' } = req.query;
    
    // First, try to find active election
    let election = await Election.findOne({ 
      createdBy:req.user,
      status: 'active',
      // isActive: true
    });

    let electionStatus = 'active';
    
    // If no active election, find the next upcoming election
    if (!election) {
      election = await Election.findOne({ 
      createdBy:req.user,
        status: 'upcoming',
        // isActive: true,
        // startDate: { $gt: new Date() }
      }).sort({ startDate: 1 }); // Get the nearest upcoming election
      // console.log(election)
      if (election) {
        electionStatus = 'upcoming';
      } else {
        // If no upcoming election, check for any election
        election = await Election.findOne({ createdBy:req.user,isActive: true }).sort({ createdAt: -1 });
        electionStatus = election ? election.status : 'no_election';
      }
    }

    let candidates = [];
    let total = 0;

    if (election && election.candidates && election.candidates.length > 0) {
      // Build filter for candidates
      // console.log(true)
      const filter = { 
        _id: { $in: election.candidates },
        isActive: true 
      };
      
      if (party && party !== 'all') {
        filter.party = party;
      }

      const sortOptions = {
        name: { name: 1 },
        votes: { votes: -1 },
        newest: { createdAt: -1 }
      };

      candidates = await Candidate.find(filter)
        .select('name party thumbnail votes bio createdAt')
        .sort(sortOptions[sortBy] || { name: 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      total = await Candidate.countDocuments(filter);
    }
// console.log(election)
    res.json({
      success: true,
      candidates,
      electionStatus,
      election: election ? {
        id: election._id,
        user:election.createdBy,
        title: election.title,
        description: election.description,
        status: election.status,
        startDate: election.startDate,
        endDate: election.endDate,
        totalCandidates: election.totalCandidates,
        totalVotes: election.totalVotes
      } : null,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      message: getElectionStatusMessage(electionStatus)
    });
    // console.log(electionStatus)
    // console.log(candidates)
    // console.log(election)
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      // error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to get status messages
const getElectionStatusMessage = (status) => {
  const messages = {
    active: 'Election is currently active. You can cast your vote now!',
    upcoming: 'Upcoming election - Voting will start soon',
    not_started: 'Election is scheduled but not started yet',
    completed: 'Election has ended. Thank you for participating.',
    cancelled: 'Election has been cancelled.',
    no_election: 'No election is currently scheduled.'
  };
  return messages[status] || 'Election status unknown.';
};


//  export const getResults = async (req, res) => {
//   try {
//     const election = await Election.findOne({ status: 'completed' })
//       .sort({ createdAt: -1 });

//     if (!election) {
//       return res.status(404).json({
//         success: false,
//         message: 'No completed election found'
//       });
//     }

//     const candidates = await Candidate.find({ 
//       election: election._id,
//       isActive: true 
//     })
//     .select('name party thumbnail votes bio')
//     .sort({ votes: -1 });

//     const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);

//     res.json({
//       success: true,
//       election: {
//         id: election._id,
//         name: election.name,
//         status: election.status,
//         startDate: election.startDate,
//         endDate: election.endDate,
//         totalVotes
//       },
//       candidates: candidates.map(candidate => ({
//         ...candidate.toObject(),
//         percentage: totalVotes > 0 ? ((candidate.votes || 0) / totalVotes) * 100 : 0
//       }))
//     });
//   } catch (error) {
//     console.error('Get election results error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };
// Get election results (for completed elections)
export const getResults = async (req, res) => {
  try {
    const election = await Election.findOne({ status: 'completed' })
      .sort({ createdAt: -1 });

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'No completed election found'
      });
    }

    const candidates = await Candidate.find({ 
      election: election._id,
      isActive: true 
    })
    .select('name party thumbnail votes bio')
    .sort({ votes: -1 });

    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);

    res.json({
      success: true,
      election: {
        id: election._id,
        name: election.name,
        status: election.status,
        startDate: election.startDate,
        endDate: election.endDate,
        totalVotes
      },
      candidates: candidates.map(candidate => ({
        ...candidate.toObject(),
        percentage: totalVotes > 0 ? ((candidate.votes || 0) / totalVotes) * 100 : 0
      }))
    });
  } catch (error) {
    console.error('Get election results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};