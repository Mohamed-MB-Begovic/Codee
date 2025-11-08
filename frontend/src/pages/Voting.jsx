 
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserGroupIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
  
import Loading from '../layout/Loading'
const Voting = () => {
  const navigate = useNavigate();
  const { user, updateVoteStatus } = useUser();
  // if(!user) {navigate('/login')}
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [electionStatus, setElectionStatus] = useState('loading');
  const [electionInfo, setElectionInfo] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);  
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/votes');
        // console.log(response)s
        
        if (response.data.success) {
          setCandidates(response.data.candidates || []);
          setElectionStatus(response.data.electionStatus);
          setElectionInfo(response.data.election);
     
        } else {
          throw new Error('Failed to fetch candidates');
        }
      } catch (error) {
        // console.error('Error fetching candidates:', error);
        // console.log(error)
        setCandidates([]);
        setElectionStatus('error');
        toast.error(error.response?.data?.message || 'Error fetching candidates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
 
   if(user) fetchCandidates();
  }, [user]);
  if(!user){
    return (
  <div className="flex flex-col items-center justify-center p-6 bg-white h-screen rounded-lg border border-gray-200 shadow-sm text-center">
      <p className="text-gray-600 mb-4 font-medium">
        Only you can vote if you login
      </p>
      <Link
        to="/login"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Login to Vote
      </Link>
    </div>
    )
  }
  // Load candidates from database

   // login in button display if there is no user

  const handleVote = async () => {
 
    if (selectedCandidate) {
      try {
        setIsSubmitting(true);
        const { data } = await axios.post('/api/votes', 
          { candidateId: selectedCandidate ,
            electionId:electionInfo.id, user:electionInfo.user}, 
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        await updateVoteStatus();
        // setElectionStatus('active');
        toast.success('Vote cast successfully!');
       
      } catch (error) {
        // console.error('Vote error:', error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred while submitting your vote. Please try again.');
        }
      }finally{
        setIsSubmitting(false);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading Vote...</p>
        </div>
      </div>
    );
  }


  // User has already voted
  if (user?.hasVoted && electionStatus === 'active' && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-800 mb-2">
              Thank You for Voting!
            </h2>
            <p className="text-green-600 mb-6">Your vote has been recorded successfully.</p>
            
            {/* Vote Details */}
            <div className="mt-6 bg-white rounded-lg p-4 border border-green-200 max-w-md mx-auto">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Election Status
              </h3>
              <p className="mt-2 text-lg font-semibold text-gray-800">
                {electionInfo?.title || 'Current Election'}
              </p>
              <p className="mt-1 text-sm font-medium text-green-600">
                VOTED • {electionStatus?.toUpperCase()}
              </p>
            </div>
            
            {/* Lock Icon */}
            <div className="mt-8 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <LockClosedIcon className="h-10 w-10 text-green-600" />
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              Your vote is now locked and cannot be changed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No candidates found
  if (candidates.length === 0 && electionStatus !== 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Candidates Available</h3>
            <p className="text-gray-500 mb-6">
              {electionStatus === 'no_election' 
                ? 'There are no scheduled elections at this time.' 
                : 'Candidates have not been announced yet for this election.'}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-md mx-auto">
              <p className="text-sm text-gray-600">
                <strong>Current Status:</strong> {electionStatus?.toUpperCase().replace('_', ' ') || 'UNKNOWN'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Determine if voting is allowed
  const isVotingAllowed = electionStatus === 'active' && !user.hasVoted && !user?.isAdmin === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {electionInfo?.title || 'Election Portal'}
          </h1>
          <p className="text-gray-600 mb-4">
            {electionInfo?.description || 'Make your voice heard'}
          </p>
          
          {/* Election Status Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            electionStatus === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
            electionStatus === 'upcoming' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
            'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            {electionStatus === 'active' && (
              <ClockIcon className="h-4 w-4 mr-2" />
            )}
            {electionStatus === 'upcoming' && (
              <ClockIcon className="h-4 w-4 mr-2" />
            )}
            {electionStatus ? electionStatus.toUpperCase().replace('_', ' ') : 'LOADING'}
          </div>

          {/* Election Dates */}
          {electionInfo && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
              {electionInfo.startDate && (
                <div>
                  <strong>Starts:</strong> {new Date(electionInfo.startDate).toLocaleDateString()}
                </div>
              )}
              {electionInfo.endDate && (
                <div>
                  <strong>Ends:</strong> {new Date(electionInfo.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Message */}
        {electionStatus && electionStatus !== 'active' && (
          <div className={`rounded-lg p-4 mb-6 text-center ${
            electionStatus === 'upcoming' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
            'bg-gray-50 border border-gray-200 text-gray-600'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              <ClockIcon className="h-5 w-5" />
              <span className="font-medium">
                {electionStatus === 'upcoming' 
                  ? `Upcoming Election - Voting starts on ${electionInfo?.startDate ? new Date(electionInfo.startDate).toLocaleDateString() : 'a future date'}`
                  : 'Voting is not currently available'}
              </span>
            </div>
          </div>
        )}

        {/* Voting Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {isVotingAllowed ? 'Select Your Candidate' : 'Candidates'}
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 ${
            !isVotingAllowed ? 'opacity-75' : ''
          }`}>
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                  isVotingAllowed 
                    ? selectedCandidate === candidate._id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 cursor-pointer'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer'
                    : 'border-gray-200 cursor-not-allowed'
                }`}
                onClick={() => isVotingAllowed && setSelectedCandidate(candidate._id)}
              >
                <div className="text-center">
                  <img
                    src={candidate.thumbnail || '/api/placeholder/150/150'}
                    alt={candidate.name}
                    className={`w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 ${
                      !isVotingAllowed ? 'grayscale' : 'border-gray-300'
                    }`}
                  />
                  <h3 className="font-semibold text-gray-800">{candidate.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{candidate.party}</p>
                  {candidate.bio && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{candidate.bio}</p>
                  )}
                  <div className={`w-4 h-4 rounded-full border-2 mx-auto ${
                    isVotingAllowed
                      ? selectedCandidate === candidate._id 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                      : 'border-gray-300'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Vote Button */}
          <div className="text-center">
            {isVotingAllowed ? (
              <>
               <button
  type="submit"
  onClick={handleVote}
  disabled={isSubmitting || !selectedCandidate || user?.hasVoted || user?.isAdmin}

 className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                    selectedCandidate
                      ? 'bg-green-600 hover:bg-green-700 shadow-lg transform hover:scale-105'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
>
  {isSubmitting ? (
    <Loading /> // 👈 use your spinner component here
  ) : selectedCandidate ? (
    "Cast Your Vote"
  ) : (
    "Select a Candidate to Vote"
  )}
</button>
                {selectedCandidate && (
                  <p className="text-sm text-gray-600 mt-3">
                    You have selected: <span className="font-semibold text-green-600">
                      {candidates.find(c => c._id === selectedCandidate)?.name}
                    </span>
                  </p>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <LockClosedIcon className="h-5 w-5" />
                  <span className="font-medium">
                    {electionStatus === 'upcoming' 
                      ? 'Voting will be enabled when the election starts'
                      : 'Voting is not currently available'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Election Statistics
        {electionInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Election Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{electionInfo.totalCandidates || 0}</div>
                <div className="text-sm text-blue-800">Candidates</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{electionInfo.totalVotes || 0}</div>
                <div className="text-sm text-green-800">Total Votes</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-sm text-purple-800">Status</div>
                <div className="text-lg font-semibold text-purple-600 capitalize">{electionInfo.status}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-orange-800">Your Status</div>
                <div className="text-lg font-semibold text-orange-600">
                  {user.hasVoted ? 'Voted' : 'Not Voted'}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Voting;