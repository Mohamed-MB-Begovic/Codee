/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaceSmileIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Results = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [electionData, setElectionData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
const {user}=useUser()
  // Load election results from backend
  useEffect(() => {
    const loadElectionResults = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/results');
        // console.log(response)
        setElectionData(response.data.data.election);
        setCandidates(response.data.data.results.candidates);
        setWinnerInfo(response.data.data.results.winner || response.data.data.results.winners[0]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 10000);
      } catch (error) {
        setError(error);
        setDefaultData();
      } finally {
        setIsLoading(false);
      }
    };

  if(user)  loadElectionResults();
  }, []);

   if(!user){
    return (
  <div className="flex flex-col items-center justify-center p-6 bg-white h-screen rounded-lg border border-gray-200 shadow-sm text-center">
      <p className="text-gray-600 mb-4 font-medium">
        Only you can see results if you login
      </p>
      <Link
        to="/login"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Login to see result
      </Link>
    </div>
    )
  }

  // Set default data if no data exists
  const setDefaultData = () => {
    setElectionData({
      title: "No Election Results", 
      totalVotes: 0,
    });
    setCandidates([]);
  };

  // Refresh results
  const refreshResults = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/results');
      setElectionData(response.data.data.election);
      setCandidates(response.data.data.results.candidates);
      setWinnerInfo(response.data.data.results.winner);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error('Error loading election results:', error);
      toast.error('Failed to load election results');
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to assign colors based on party
  const getCandidateColor = (party) => {
    const colorMap = {
      'Student Union Party': 'bg-blue-500',
      'Progressive Alliance': 'bg-green-500',
      'Academic Excellence': 'bg-yellow-500',
      'Independent': 'bg-purple-500',
      'Green Campus Initiative': 'bg-emerald-500',
      'Technology Forward': 'bg-indigo-500'
    };
    return colorMap[party] || 'bg-gray-500';
  };

  // Confetti component with CSS animations
  const Confetti = () => {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        {[...Array(100)].map((_, i) => {
          const left = Math.random() * 100;
          const animationDelay = Math.random() * 5;
          const size = Math.floor(Math.random() * 10) + 5;
          const colors = ['bg-yellow-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const duration = Math.random() * 3 + 2;
          
          return (
            <div
              key={i}
              className={`absolute ${color} rounded-sm`}
              style={{
                left: `${left}%`,
                top: '-20px',
                width: `${size}px`,
                height: `${size}px`,
                animation: `confettiFall ${duration}s linear ${animationDelay}s forwards`,
                opacity: Math.random() * 0.7 + 0.3,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          );
        })}
        
        <style >{`
          @keyframes confettiFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading election results...</p>
        </div>
      </div>
    );
  }

  if (!electionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Election Data</h2>
          <p className="text-gray-600 mb-4">No election results available yet.</p>
          {/* <button
            onClick={refreshResults}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Check Again
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {showConfetti && <Confetti />}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Election Results</h1>
          <p className="text-gray-600">{electionData.title}</p>
        </div>

        {/* Winner Banner */}
        {winnerInfo && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg p-6 mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <img
                  src={winnerInfo.thumbnail || '/api/placeholder/150/150'}
                  alt={winnerInfo.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                  <TrophyIcon className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
                <p className="text-yellow-100 mt-1">
                  {winnerInfo.name} has won with {winnerInfo.votePercentage}% of votes
                </p>
                <p className="text-yellow-200 text-sm mt-2">
                  {winnerInfo.party}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white rounded-full p-3">
                  <FaceSmileIcon className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Chart */}
        {!error && candidates !== null && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 md:mb-19 ">
            <div className="flex justify-between items-center mb-6  ">
              <h2 className="text-xl font-bold text-gray-800">Vote Distribution</h2>
              {/* <button
                onClick={refreshResults}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Results
              </button> */}
            </div>

            <div className="space-y-6">
              {candidates?.length > 0 ? (
                candidates.map((candidate) => (
                  <div key={candidate.candidateId} className="flex items-center">
                    <img
                      src={candidate.thumbnail || '/api/placeholder/150/150'}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <span className="text-sm font-medium text-gray-900">
                          {candidate.votePercentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{candidate.party}</p>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getCandidateColor(candidate.party)} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${candidate.votePercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{candidate.votes} votes</span>
                        <span>{candidate.votePercentage}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Candidates</h3>
                  <p className="text-gray-500">No candidates have been added to the election yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;