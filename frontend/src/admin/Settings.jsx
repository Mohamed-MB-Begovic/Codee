/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [deletedCandidates, setDeletedCandidates] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [usersSearchTerm, setUsersSearchTerm] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [systemInfo, setSystemInfo] = useState(null);
  const [candidatesSearchTerm, setCandidatesSearchTerm] = useState('');

  // Modal states
  const [showResetAllVotesModal, setShowResetAllVotesModal] = useState(false);
  const [showResetUserVotesModal, setShowResetUserVotesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRestoreCandidateModal, setShowRestoreCandidateModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showRestoreAllModal, setShowRestoreAllModal] = useState(false);
  
  // User management modal states
  const [showRestoreUserModal, setShowRestoreUserModal] = useState(false);
  const [showPermanentDeleteUserModal, setShowPermanentDeleteUserModal] = useState(false);
  const [showRestoreAllUsersModal, setShowRestoreAllUsersModal] = useState(false);

  // Loading states for actions
  const [isResettingAllVotes, setIsResettingAllVotes] = useState(false);
  const [isResettingUserVotes, setIsResettingUserVotes] = useState(false);
  const [isRestoringCandidate, setIsRestoringCandidate] = useState(false);
  const [isPermanentlyDeleting, setIsPermanentlyDeleting] = useState(false);
  const [isRestoringAll, setIsRestoringAll] = useState(false);
  
  // User management loading states
  const [isRestoringUser, setIsRestoringUser] = useState(false);
  const [isPermanentlyDeletingUser, setIsPermanentlyDeletingUser] = useState(false);
  const [isRestoringAllUsers, setIsRestoringAllUsers] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
    if (activeTab === 'overview') {
      loadStatistics();
    }
    if (activeTab === 'deleted-candidates') {
      loadDeletedCandidates();
    }
    if (activeTab === 'deleted-users') {
      loadDeletedUsers();
    }
  }, [activeTab, searchTerm, candidatesSearchTerm, usersSearchTerm]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/settings/users', {
        params: { search: searchTerm }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeletedCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/settings/candidates/deleted', {
        params: { search: candidatesSearchTerm }
      });
      if (response.data.success) {
        setDeletedCandidates(response.data.candidates);
      }
    } catch (error) {
      toast.error('Failed to load deleted candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeletedUsers = async () => {
 
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/settings/users/deleted', {
        params: { search: usersSearchTerm }
      });
      // console.log('user')
      if (response.data.success) {
        setDeletedUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Failed to load deleted users');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/admin/settings/statistics');
      if (response.data.success) {
        setSystemInfo(response.data.server);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      toast.error('Failed to load statistics');
    }
    finally { setIsLoading(false) } 
  };

  const handleRefresh = async () => {
    if (activeTab === 'users') {
      loadUsers();
    }
    if (activeTab === 'overview') {
      loadStatistics();
    }
    if (activeTab === 'deleted-candidates') {
      loadDeletedCandidates();
    }
    if (activeTab === 'deleted-users') {
      loadDeletedUsers();
    }
  }

  // Reset Votes Functions
  const handleResetAllVotesClick = () => {
    setShowResetAllVotesModal(true);
  };

  const handleResetUserVotesClick = (user) => {
    setSelectedUser(user);
    setShowResetUserVotesModal(true);
  };

  const resetAllVotes = async () => {
    setIsResettingAllVotes(true);
    try {
      const response = await axios.post('/api/admin/settings/users/reset-votes', {
        resetAll: true
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        loadUsers();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to reset voting status');
    } finally {
      setIsResettingAllVotes(false);
      setShowResetAllVotesModal(false);
    }
  };

  const resetUserVotes = async () => {
    setIsResettingUserVotes(true);
    try {
      const response = await axios.post('/api/admin/settings/users/reset-votes', {
        userId: selectedUser._id,
        resetAll: false
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        loadUsers();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to reset voting status');
    } finally {
      setIsResettingUserVotes(false);
      setShowResetUserVotesModal(false);
      setSelectedUser(null);
    }
  };

  // Candidate Management Functions
  const handleRestoreCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowRestoreCandidateModal(true);
  };

  const handlePermanentDeleteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowPermanentDeleteModal(true);
  };

  const handleRestoreAllClick = () => {
    setShowRestoreAllModal(true);
  };

  const restoreCandidate = async () => {
    setIsRestoringCandidate(true);
    try {
      const response = await axios.put(`/api/admin/settings/candidates/${selectedCandidate._id}/restore`);
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedCandidates();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to restore candidate');
    } finally {
      setIsRestoringCandidate(false);
      setShowRestoreCandidateModal(false);
      setSelectedCandidate(null);
    }
  };

  const permanentlyDeleteCandidate = async () => {
    setIsPermanentlyDeleting(true);
    try {
      const response = await axios.delete(`/api/admin/settings/candidates/${selectedCandidate._id}/permanent`);
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedCandidates();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to delete candidate permanently');
    } finally {
      setIsPermanentlyDeleting(false);
      setShowPermanentDeleteModal(false);
      setSelectedCandidate(null);
    }
  };

  const restoreAllCandidates = async () => {
    setIsRestoringAll(true);
    try {
      const response = await axios.put('/api/admin/settings/candidates/restore-all');
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedCandidates();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to restore all candidates');
    } finally {
      setIsRestoringAll(false);
      setShowRestoreAllModal(false);
    }
  };

  // User Management Functions
  const handleRestoreUserClick = (user) => {
    setSelectedUser(user);
    setShowRestoreUserModal(true);
  };

  const handlePermanentDeleteUserClick = (user) => {
    setSelectedUser(user);
    setShowPermanentDeleteUserModal(true);
  };

  const handleRestoreAllUsersClick = () => {
    setShowRestoreAllUsersModal(true);
  };

  const restoreUser = async () => {
    // console.log('restore user')
    setIsRestoringUser(true);
    try {
      const response = await axios.put(`/api/admin/settings/users/${selectedUser._id}/restore`);
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedUsers();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to restore user');
    } finally {
      setIsRestoringUser(false);
      setShowRestoreUserModal(false);
      setSelectedUser(null);
    }
  };

  const permanentlyDeleteUser = async () => {
    setIsPermanentlyDeletingUser(true);
    try {
      const response = await axios.delete(`/api/admin/settings/users/${selectedUser._id}/permanent`);
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedUsers();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to delete user permanently');
    } finally {
      setIsPermanentlyDeletingUser(false);
      setShowPermanentDeleteUserModal(false);
      setSelectedUser(null);
    }
  };

  const restoreAllUsers = async () => {
    setIsRestoringAllUsers(true);
    try {
      const response = await axios.put('/api/admin/settings/users/restore-all');
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedUsers();
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to restore all users');
    } finally {
      setIsRestoringAllUsers(false);
      setShowRestoreAllUsersModal(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'User Management', icon: UsersIcon },
    { id: 'deleted-candidates', name: 'Deleted Candidates', icon: ArchiveBoxIcon },
    { id: 'deleted-users', name: 'Deleted Users', icon: ArchiveBoxIcon },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-gray-600 mt-2">Manage users and elections</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <ButtonLoadingSpinner />
            ) : (
              <ArrowPathIcon className="h-5 w-5 mr-2" />
            )}
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex overflow-x-auto scrollbar-hide space-x-4 sm:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap py-3 px-3 sm:py-4 sm:px-4 border-b-2 font-medium text-sm transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">System Overview</h2>
              {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800">Users</h3>
                    <p className="text-2xl font-bold text-blue-600">{statistics.users.total}</p>
                    <p className="text-sm text-blue-700">
                      {statistics.users.voted} voted ({statistics.users.participationRate}%)
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800">Elections</h3>
                    <p className="text-2xl font-bold text-green-600">{statistics.elections.total}</p>
                    <p className="text-sm text-green-700">
                      {statistics.elections.active} active
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-800">Votes</h3>
                    <p className="text-2xl font-bold text-purple-600">{statistics.votes.total}</p>
                    <p className="text-sm text-purple-700">
                      Avg: {statistics.votes.averagePerElection} per election
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-800">Candidates</h3>
                    <p className="text-2xl font-bold text-orange-600">{statistics.candidates.total}</p>
                    <p className="text-sm text-orange-700">
                      Avg: {statistics.candidates.averagePerElection} per election
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleResetAllVotesClick}
                      className="w-full flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ButtonLoadingSpinner />
                      ) : (
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                      )}
                      {isLoading ? 'Loading...' : 'Reset All User Votes'}
                    </button>
                    <button
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ButtonLoadingSpinner />
                      ) : (
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                      )}
                      {isLoading ? 'Loading...' : 'Create Backup'}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">System Info</h3>
                  {systemInfo && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Node Version:</span>
                        <span className="font-mono">{systemInfo.nodeVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform:</span>
                        <span className="font-mono">{systemInfo.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="font-mono">
                          {Math.floor(systemInfo.uptime / 60)} minutes
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">User Management</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleResetAllVotesClick}
                    className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ButtonLoadingSpinner />
                    ) : (
                      <ArrowPathIcon className="h-5 w-5 mr-2" />
                    )}
                    {isLoading ? 'Loading...' : 'Reset All'}
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['User', 'Role', 'Voting Status', 'Actions'].map((heading) => (
                            <th
                              key={heading}
                              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.studentId && (
                                  <div className="text-sm text-gray-400">ID: {user.studentId}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.hasVoted
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {user.hasVoted ? 'Voted' : 'Not Voted'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {user.hasVoted && (
                                <button
                                  onClick={() => handleResetUserVotesClick(user)}
                                  className="text-yellow-600 hover:text-yellow-900 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <ButtonLoadingSpinner size="small" />
                                  ) : (
                                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                                  )}
                                  {isLoading ? 'Resetting...' : 'Reset Vote'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No users found</div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Deleted Candidates Tab */}
          {activeTab === 'deleted-candidates' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Deleted Candidates Management
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    Restore or permanently delete soft-deleted candidates
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search deleted candidates..."
                    value={candidatesSearchTerm}
                    onChange={(e) => setCandidatesSearchTerm(e.target.value)}
                    className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {deletedCandidates.length > 0 && (
                    <button
                      onClick={handleRestoreAllClick}
                      className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ButtonLoadingSpinner />
                      ) : (
                        <ArrowUpIcon className="h-5 w-5 mr-2" />
                      )}
                      {isLoading ? 'Loading...' : 'Restore All'}
                    </button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading deleted candidates...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Candidate', 'Party & Course', 'Election', 'Deleted Date', 'Votes', 'Actions'].map(
                            (heading) => (
                              <th
                                key={heading}
                                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {heading}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {deletedCandidates.map((candidate) => (
                          <tr key={candidate._id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  className="h-10 w-10 rounded-full object-cover mr-3"
                                  src={candidate.thumbnail || 'https://via.placeholder.com/150?text=No+Image'}
                                  alt={candidate.name}
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                  <div className="text-sm text-gray-500">{candidate.year}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <div>{candidate.party}</div>
                              <div className="text-gray-500">{candidate.course}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <div>{candidate.election?.title || 'N/A'}</div>
                              <div className="text-gray-500">
                                {candidate.election?.status || 'Unknown'}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {candidate.deletedAt
                                ? new Date(candidate.deletedAt).toLocaleDateString()
                                : 'Unknown'}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {candidate.votes || 0}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                              <button
                                onClick={() => handleRestoreCandidateClick(candidate)}
                                className="flex items-center text-green-600 hover:text-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <ButtonLoadingSpinner size="small" />
                                ) : (
                                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                                )}
                                {isLoading ? 'Loading...' : 'Restore'}
                              </button>
                              <button
                                onClick={() => handlePermanentDeleteClick(candidate)}
                                className="flex items-center text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <ButtonLoadingSpinner size="small" />
                                ) : (
                                  <TrashIcon className="h-4 w-4 mr-1" />
                                )}
                                {isLoading ? 'Loading...' : 'Delete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {deletedCandidates.length === 0 && (
                    <div className="text-center py-12">
                      <ArchiveBoxIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Deleted Candidates</h3>
                      <p className="text-gray-500 text-sm sm:text-base">
                        There are no soft-deleted candidates to manage.
                      </p>
                    </div>
                  )}
                </>
              )}
              {deletedCandidates.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                    Deleted Candidates Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Deleted:</span>
                      <span className="ml-2 font-semibold">{deletedCandidates.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Votes Lost:</span>
                      <span className="ml-2 font-semibold">
                        {deletedCandidates.reduce((sum, c) => sum + (c.votes || 0), 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Oldest Deletion:</span>
                      <span className="ml-2 font-semibold">
                        {deletedCandidates.length > 0
                          ? new Date(
                              Math.min(
                                ...deletedCandidates.map((c) =>
                                  new Date(c.deletedAt || Date.now())
                                )
                              )
                            ).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Active Elections Affected:</span>
                      <span className="ml-2 font-semibold">
                        {
                          new Set(
                            deletedCandidates.map((c) => c.election?._id).filter((id) => id)
                          ).size
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deleted Users Tab */}
          {activeTab === 'deleted-users' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Deleted Users Management
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    Restore or permanently delete soft-deleted users
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search deleted users..."
                    value={usersSearchTerm}
                    onChange={(e) => setUsersSearchTerm(e.target.value)}
                    className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {deletedUsers.length > 0 && (
                    <button
                      onClick={handleRestoreAllUsersClick}
                      className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ButtonLoadingSpinner />
                      ) : (
                        <ArrowUpIcon className="h-5 w-5 mr-2" />
                      )}
                      {isLoading ? 'Loading...' : 'Restore All'}
                    </button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading deleted users...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['User', 'Role', 'Deleted Date', 'Voting Status', 'Actions'].map((heading) => (
                            <th
                              key={heading}
                              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {deletedUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  {user.studentId && (
                                    <div className="text-sm text-gray-500">ID: {user.studentId}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                        
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.deletedAt
                                ? new Date(user.deletedAt).toLocaleDateString()
                                : 'Unknown'}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.hasVoted
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {user.hasVoted ? 'Voted' : 'Not Voted'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                              <button
                                onClick={() => handleRestoreUserClick(user)}
                                className="flex items-center text-green-600 hover:text-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <ButtonLoadingSpinner size="small" />
                                ) : (
                                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                                )}
                                {isLoading ? 'Loading...' : 'Restore'}
                              </button>
                              <button
                                onClick={() => handlePermanentDeleteUserClick(user)}
                                className="flex items-center text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <ButtonLoadingSpinner size="small" />
                                ) : (
                                  <TrashIcon className="h-4 w-4 mr-1" />
                                )}
                                {isLoading ? 'Loading...' : 'Delete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {deletedUsers.length === 0 && (
                    <div className="text-center py-12">
                      <ArchiveBoxIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Deleted Users</h3>
                      <p className="text-gray-500 text-sm sm:text-base">
                        There are no soft-deleted users to manage.
                      </p>
                    </div>
                  )}
                </>
              )}
              {deletedUsers.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                    Deleted Users Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Deleted:</span>
                      <span className="ml-2 font-semibold">{deletedUsers.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Admins:</span>
                      <span className="ml-2 font-semibold">
                        {deletedUsers.filter(user => user.role === 'admin').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Voters:</span>
                      <span className="ml-2 font-semibold">
                        {deletedUsers.filter(user => user.role === 'voter').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Had Voted:</span>
                      <span className="ml-2 font-semibold">
                        {deletedUsers.filter(user => user.hasVoted).length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      
      {/* Reset All Votes Modal */}
      <ConfirmationModal
        isOpen={showResetAllVotesModal}
        onClose={() => setShowResetAllVotesModal(false)}
        onConfirm={resetAllVotes}
        title="Reset All User Votes"
        description="Are you sure you want to reset ALL users' voting status? This will allow all users to vote again. This action cannot be undone."
        confirmText="Reset All Votes"
        confirmColor="yellow"
        isLoading={isResettingAllVotes}
      />

      {/* Reset User Votes Modal */}
      <ConfirmationModal
        isOpen={showResetUserVotesModal}
        onClose={() => {
          setShowResetUserVotesModal(false);
          setSelectedUser(null);
        }}
        onConfirm={resetUserVotes}
        title={`Reset ${selectedUser?.name}'s Vote`}
        description={`Are you sure you want to reset ${selectedUser?.name}'s voting status? This will allow them to vote again.`}
        confirmText="Reset Vote"
        confirmColor="yellow"
        isLoading={isResettingUserVotes}
      />

      {/* Restore Candidate Modal */}
      <ConfirmationModal
        isOpen={showRestoreCandidateModal}
        onClose={() => {
          setShowRestoreCandidateModal(false);
          setSelectedCandidate(null);
        }}
        onConfirm={restoreCandidate}
        title={`Restore ${selectedCandidate?.name}`}
        description={`Are you sure you want to restore ${selectedCandidate?.name}? They will be available for elections again and their votes will be restored.`}
        confirmText="Restore Candidate"
        confirmColor="green"
        isLoading={isRestoringCandidate}
      />

      {/* Permanent Delete Candidate Modal */}
      <ConfirmationModal
        isOpen={showPermanentDeleteModal}
        onClose={() => {
          setShowPermanentDeleteModal(false);
          setSelectedCandidate(null);
        }}
        onConfirm={permanentlyDeleteCandidate}
        title={`Permanently Delete ${selectedCandidate?.name}`}
        description={`Are you absolutely sure you want to permanently delete ${selectedCandidate?.name}? This action cannot be undone and all associated data (including ${selectedCandidate?.votes || 0} votes) will be permanently lost.`}
        confirmText="Delete Permanently"
        confirmColor="red"
        isLoading={isPermanentlyDeleting}
      />

      {/* Restore All Candidates Modal */}
      <ConfirmationModal
        isOpen={showRestoreAllModal}
        onClose={() => setShowRestoreAllModal(false)}
        onConfirm={restoreAllCandidates}
        title="Restore All Deleted Candidates"
        description={`Are you sure you want to restore ALL ${deletedCandidates.length} deleted candidates? They will be available for elections again and their votes will be restored.`}
        confirmText="Restore All"
        confirmColor="green"
        isLoading={isRestoringAll}
      />

      {/* User Management Modals */}
      <ConfirmationModal
        isOpen={showRestoreUserModal}
        onClose={() => {
          setShowRestoreUserModal(false);
          setSelectedUser(null);
        }}
        onConfirm={restoreUser}
        title={`Restore ${selectedUser?.name}`}
        description={`Are you sure you want to restore ${selectedUser?.name}? They will be able to login and participate in elections again.`}
        confirmText="Restore User"
        confirmColor="green"
        isLoading={isRestoringUser}
      />

      <ConfirmationModal
        isOpen={showPermanentDeleteUserModal}
        onClose={() => {
          setShowPermanentDeleteUserModal(false);
          setSelectedUser(null);
        }}
        onConfirm={permanentlyDeleteUser}
        title={`Permanently Delete ${selectedUser?.name}`}
        description={`Are you absolutely sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone and all associated data will be permanently lost.`}
        confirmText="Delete Permanently"
        confirmColor="red"
        isLoading={isPermanentlyDeletingUser}
      />

      <ConfirmationModal
        isOpen={showRestoreAllUsersModal}
        onClose={() => setShowRestoreAllUsersModal(false)}
        onConfirm={restoreAllUsers}
        title="Restore All Deleted Users"
        description={`Are you sure you want to restore ALL ${deletedUsers.length} deleted users? They will be able to login and participate in elections again.`}
        confirmText="Restore All"
        confirmColor="green"
        isLoading={isRestoringAllUsers}
      />
    </div>
  );
};

// Reusable Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText, 
  confirmColor = 'blue',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    yellow: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    red: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0  backdrop-blur-[10px] bg-opacity-50 transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${colorClasses[confirmColor]} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <ButtonLoadingSpinner />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                confirmText
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Loading Spinner Component for Buttons
const ButtonLoadingSpinner = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'h-3 w-3',
    default: 'h-4 w-4'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${sizeClasses[size]}`}></div>
  );
};

export default Settings;