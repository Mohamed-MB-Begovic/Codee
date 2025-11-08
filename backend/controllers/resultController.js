import Election  from '../models/Election.js';
import Candidate  from '../models/Candidate.js';
import Vote  from '../models/Vote.js';

export const getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    // Validate election ID
    if (!electionId) {
      return res.status(400).json({
        success: false,
        message: 'Election ID is required'
      });
    }

    // Find the election
    const election = await Election.findById(electionId);
    
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Check if results are published
    if (!election.resultsPublished && election.status !== 'completed') {
      return res.status(403).json({
        success: false,
        message: 'Results are not yet published for this election'
      });
    }

    // Get all candidates for this election
    const candidates = await Candidate.find({ 
      election: electionId,
      isActive: true 
    });

    // Get all votes for this election
    const votes = await Vote.find({
      candidateId: { $in: election.candidates }
    });

    // Calculate results
    const candidateResults = candidates.map(candidate => {
      const candidateVotes = votes.filter(vote => 
        vote.candidateId.toString() === candidate._id.toString()
      ).length;

      const votePercentage = election.totalVotes > 0 
        ? (candidateVotes / election.totalVotes) * 100 
        : 0;

      return {
        candidateId: candidate._id,
        name: candidate.name,
        party: candidate.party,
        course: candidate.course,
        year: candidate.year,
        thumbnail: candidate.thumbnail,
        votes: candidateVotes,
        votePercentage: votePercentage.toFixed(2),
        manifesto: candidate.manifesto,
        bio: candidate.bio
      };
    });

    // Sort candidates by votes (descending)
    candidateResults.sort((a, b) => b.votes - a.votes);

    // Determine winner(s) - handle ties
    const maxVotes = candidateResults.length > 0 ? candidateResults[0].votes : 0;
    const winners = candidateResults.filter(candidate => candidate.votes === maxVotes);

    // Prepare final results
    const electionResults = {
      election: {
        _id: election._id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        status: election.status,
        totalCandidates: election.totalCandidates,
        totalVotes: election.totalVotes,
        totalVoters: election.totalVoters,
        resultsPublished: election.resultsPublished
      },
      results: {
        candidates: candidateResults,
        winner: winners.length === 1 ? winners[0] : null,
        isTie: winners.length > 1,
        winners: winners.length > 1 ? winners : [],
        summary: {
          totalVotesCast: election.totalVotes,
          totalEligibleVoters: election.totalVoters,
          voterTurnout: election.totalVoters > 0 
            ? ((election.totalVotes / election.totalVoters) * 100).toFixed(2)
            : '0.00',
          numberOfCandidates: election.totalCandidates
        }
      }
    };

    res.status(200).json({
      success: true,
      data: electionResults
    });

  } catch (error) {
    console.error('Error fetching election results:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
export const getLatestElectionResults = async (req, res) => {

  try {
 
    // Find the most recent completed election
    const latestElection = await Election.findOne({
      createdBy:req.user,
      status: 'completed',
      resultsPublished: true
    })
    // .sort({ endDate: -1 });

    if (!latestElection) {
      return res.status(404).json({
        success: false,
        message: 'No completed elections found'
      });
    }

  

    // Get candidates and votes for this election
    const candidates = await Candidate.find({ 
      election: latestElection._id 
    });

    const votes = await Vote.find({
      candidateId: { $in: latestElection.candidates }
    });

    // Calculate results
    const candidateResults = candidates.map(candidate => {
      const candidateVotes = votes.filter(vote => 
        vote.candidateId.toString() === candidate._id.toString()
      ).length;

      const votePercentage = latestElection.totalVotes > 0 
        ? (candidateVotes / latestElection.totalVotes) * 100 
        : 0;

      return {
        candidateId: candidate._id,
        name: candidate.name,
        party: candidate.party,
        course: candidate.course,
        year: candidate.year,
        thumbnail: candidate.thumbnail,
        votes: candidateVotes,
        votePercentage: votePercentage.toFixed(0),
        manifesto: candidate.manifesto,
        bio: candidate.bio
      };
    });

    // Sort by votes
    candidateResults.sort((a, b) => b.votes - a.votes);

    const maxVotes = candidateResults.length > 0 ? candidateResults[0].votes : 0;
    const winners = candidateResults.filter(candidate => candidate.votes === maxVotes);

    const results = {
      election: {
        _id: latestElection._id,
        title: latestElection.title,
        description: latestElection.description,
        startDate: latestElection.startDate,
        endDate: latestElection.endDate,
        status: latestElection.status,
        totalCandidates: latestElection.totalCandidates,
        totalVotes: latestElection.totalVotes,
        totalVoters: latestElection.totalVoters,
        resultsPublished: latestElection.resultsPublished
      },
      results: {
        candidates: candidateResults,
        winner: winners.length === 1 ? winners[0] : null,
        isTie: winners.length > 1,
        winners: winners.length > 1 ? winners : [],
        summary: {
          totalVotesCast: latestElection.totalVotes,
          totalEligibleVoters: latestElection.totalVoters,
          voterTurnout: latestElection.totalVoters > 0 
            ? ((latestElection.totalVotes / latestElection.totalVoters) * 100).toFixed(2)
            : '0.00',
          numberOfCandidates: latestElection.totalCandidates
        }
      }
    };

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Error fetching latest election results:', error);
    res.status(404).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
// Get results for all completed elections
export const getAllElectionResults = async (req, res) => {
  try {
    const completedElections = await Election.find({ 
      status: 'completed',
      resultsPublished: true 
    }).sort({ endDate: -1 });

    const electionsWithResults = await Promise.all(
      completedElections.map(async (election) => {
        const candidates = await Candidate.find({ election: election._id });
        const votes = await Vote.find({ candidateId: { $in: election.candidates } });

        const candidateResults = candidates.map(candidate => {
          const candidateVotes = votes.filter(vote => 
            vote.candidateId.toString() === candidate._id.toString()
          ).length;

          return {
            candidateId: candidate._id,
            name: candidate.name,
            party: candidate.party,
            votes: candidateVotes
          };
        });

        candidateResults.sort((a, b) => b.votes - a.votes);
        const winner = candidateResults.length > 0 ? candidateResults[0] : null;

        return {
          election: {
            _id: election._id,
            title: election.title,
            endDate: election.endDate,
            totalVotes: election.totalVotes,
            totalVoters: election.totalVoters
          },
          winner: winner,
          topCandidates: candidateResults.slice(0, 3)
        };
      })
    );

    res.status(200).json({
      success: true,
      data: electionsWithResults
    });

  } catch (error) {
    console.error('Error fetching all election results:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Publish election results (admin function)
export const publishElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findByIdAndUpdate(
      electionId,
      { 
        resultsPublished: true,
        status: 'completed'
      },
      { new: true }
    );

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Election results published successfully',
      data: election
    });

  } catch (error) {
    console.error('Error publishing election results:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

 