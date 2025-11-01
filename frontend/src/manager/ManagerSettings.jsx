/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  ArrowPathIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManagerSettings = () => {
  const [activeTab, setActiveTab] = useState('deleted-users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [usersSearchTerm, setUsersSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // User management modal states
  const [showRestoreUserModal, setShowRestoreUserModal] = useState(false);
  const [showPermanentDeleteUserModal, setShowPermanentDeleteUserModal] = useState(false);
  const [showRestoreAllUsersModal, setShowRestoreAllUsersModal] = useState(false);

  // Data management modal states
  const [showDeleteAllUsersModal, setShowDeleteAllUsersModal] = useState(false);
  const [showDeleteAllCandidatesModal, setShowDeleteAllCandidatesModal] = useState(false);
  const [showDeleteAllElectionsModal, setShowDeleteAllElectionsModal] = useState(false);
  const [showDeleteAllVotesModal, setShowDeleteAllVotesModal] = useState(false);
  const [showDeleteEverythingModal, setShowDeleteEverythingModal] = useState(false);

  // User management loading states
  const [isRestoringUser, setIsRestoringUser] = useState(false);
  const [isPermanentlyDeletingUser, setIsPermanentlyDeletingUser] = useState(false);
  const [isRestoringAllUsers, setIsRestoringAllUsers] = useState(false);

  // Data management loading states
  const [isDeletingUsers, setIsDeletingUsers] = useState(false);
  const [isDeletingCandidates, setIsDeletingCandidates] = useState(false);
  const [isDeletingElections, setIsDeletingElections] = useState(false);
  const [isDeletingVotes, setIsDeletingVotes] = useState(false);
  const [isDeletingEverything, setIsDeletingEverything] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'deleted-users') {
      loadDeletedUsers();
    }
    if (activeTab === 'data-management') {
      loadStatistics();
    }
  }, [activeTab, usersSearchTerm]);

  const loadDeletedUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/manager/settings/users/deleted', {
        params: { search: usersSearchTerm }
      });
      if (response.data.success) {
        setDeletedUsers(response.data.users);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load deleted users');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/manager/settings/statistics');
      // console.log(response)
      if (response.data.success) {
        
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (activeTab === 'deleted-users') {
      loadDeletedUsers();
    }
    if (activeTab === 'data-management') {
      loadStatistics();
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
    setIsRestoringUser(true);
    try {
      const response = await axios.put(`/api/manager/settings/users/${selectedUser._id}/restore`);
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedUsers();
      }
    } catch (error) {
      console.log(error);
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
      const response = await axios.delete(`/api/manager/settings/users/${selectedUser._id}/permanent`);
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedUsers();
      }
    } catch (error) {
      toast.error('Failed to delete user permanently');
      console.log(error);
    } finally {
      setIsPermanentlyDeletingUser(false);
      setShowPermanentDeleteUserModal(false);
      setSelectedUser(null);
    }
  };

  const restoreAllUsers = async () => {
    setIsRestoringAllUsers(true);
    try {
      const response = await axios.put('/api/manager/settings/users/restore-all');
      if (response.data.success) {
        toast.success(response.data.message);
        loadDeletedUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to restore all users');
    } finally {
      setIsRestoringAllUsers(false);
      setShowRestoreAllUsersModal(false);
    }
  };

  // Data Management Functions
  const deleteAllUsers = async () => {
    setIsDeletingUsers(true);
    try {
      const response = await axios.delete('/api/manager/settings/users');
      if (response.data.success) {
        toast.success(response.data.message);
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to delete all users');
    } finally {
      setIsDeletingUsers(false);
      setShowDeleteAllUsersModal(false);
    }
  };

  const deleteAllCandidates = async () => {
    setIsDeletingCandidates(true);
    try {
      const response = await axios.delete('/api/manager/settings/candidates');
      if (response.data.success) {
        toast.success(response.data.message);
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to delete all candidates');
    } finally {
      setIsDeletingCandidates(false);
      setShowDeleteAllCandidatesModal(false);
    }
  };

  const deleteAllElections = async () => {
    setIsDeletingElections(true);
    try {
      const response = await axios.delete('/api/manager/settings/elections');
      if (response.data.success) {
        toast.success(response.data.message);
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to delete all elections');
    } finally {
      setIsDeletingElections(false);
      setShowDeleteAllElectionsModal(false);
    }
  };

  const deleteAllVotes = async () => {
    setIsDeletingVotes(true);
    try {
      const response = await axios.delete('/api/manager/settings/votes');
      if (response.data.success) {
        toast.success(response.data.message);
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to delete all votes');
    } finally {
      setIsDeletingVotes(false);
      setShowDeleteAllVotesModal(false);
    }
  };

  const deleteEverything = async () => {
    setIsDeletingEverything(true);
    try {
      const response = await axios.delete('/api/manager/settings/everything');
      if (response.data.success) {
        toast.success(response.data.message);
        loadStatistics();
      }
    } catch (error) {
      toast.error('Failed to delete all data');
    } finally {
      setIsDeletingEverything(false);
      setShowDeleteEverythingModal(false);
    }
  };

  const tabs = [
    { id: 'deleted-users', name: 'Deleted Users', icon: ArchiveBoxIcon },
    { id: 'data-management', name: 'Data Management', icon: TrashIcon }
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

          {/* Data Management Tab */}
          {activeTab === 'data-management' && (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Management</h2>
                <p className="text-gray-600">
                  Permanently delete all data. These actions are irreversible and will remove all records from the database.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delete All Users Card */}
                <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-700">Delete All Users</h3>
                    <UsersIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Permanently delete all users from the system. This will remove all voter and admin accounts.
                  </p>
                  <div className="bg-red-50 p-3 rounded-md mb-4">
                    <div className="flex items-center text-sm text-red-700">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>This will delete {statistics?.users?.total || 0} users</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteAllUsersModal(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !statistics?.users?.total}
                  >
                    Delete All Users
                  </button>
                </div>

                {/* Delete All Candidates Card */}
                <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-700">Delete All Candidates</h3>
                    <UsersIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Permanently delete all candidates and their associated data from the system.
                  </p>
                  <div className="bg-red-50 p-3 rounded-md mb-4">
                    <div className="flex items-center text-sm text-red-700">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>This will delete {statistics?.candidates?.total || 0} candidates</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteAllCandidatesModal(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !statistics?.candidates?.total}
                  >
                    Delete All Candidates
                  </button>
                </div>

                {/* Delete All Elections Card */}
                <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-700">Delete All Elections</h3>
                    <ChartBarIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Permanently delete all elections, including their candidates and voting data.
                  </p>
                  <div className="bg-red-50 p-3 rounded-md mb-4">
                    <div className="flex items-center text-sm text-red-700">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>This will delete {statistics?.elections?.total || 0} elections</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteAllElectionsModal(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !statistics?.elections?.total}
                  >
                    Delete All Elections
                  </button>
                </div>

                {/* Delete All Votes Card */}
                <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-700">Delete All Votes</h3>
                    <DocumentArrowDownIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Permanently delete all voting records. This will reset voting status for all users.
                  </p>
                  <div className="bg-red-50 p-3 rounded-md mb-4">
                    <div className="flex items-center text-sm text-red-700">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>This will delete {statistics?.votes?.total || 0} votes</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteAllVotesModal(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !statistics?.votes?.total}
                  >
                    Delete All Votes
                  </button>
                </div>
              </div>

              {/* Nuclear Option - Delete Everything */}
              <div className="mt-8 bg-red-50 border border-red-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-800">Nuclear Option</h3>
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-red-700 text-sm mb-4">
                  This will permanently delete ALL data from the system - users, candidates, elections, and votes. This action cannot be undone and will reset the entire system.
                </p>
                <button
                  onClick={() => setShowDeleteEverythingModal(true)}
                  className="w-full bg-red-800 text-white py-3 px-4 rounded-md hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  disabled={isLoading}
                >
                  Delete Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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

      {/* Data Management Modals */}
      <ConfirmationModal
        isOpen={showDeleteAllUsersModal}
        onClose={() => setShowDeleteAllUsersModal(false)}
        onConfirm={deleteAllUsers}
        title="Delete All Users"
        description={`Are you absolutely sure you want to delete ALL ${statistics?.users?.total || 0} users? This will remove all voter accounts and cannot be undone. The current admin account will be preserved.`}
        confirmText="Delete All Users"
        confirmColor="red"
        isLoading={isDeletingUsers}
      />

      <ConfirmationModal
        isOpen={showDeleteAllCandidatesModal}
        onClose={() => setShowDeleteAllCandidatesModal(false)}
        onConfirm={deleteAllCandidates}
        title="Delete All Candidates"
        description={`Are you absolutely sure you want to delete ALL ${statistics?.candidates?.total || 0} candidates? This action cannot be undone and will remove all candidate data.`}
        confirmText="Delete All Candidates"
        confirmColor="red"
        isLoading={isDeletingCandidates}
      />

      <ConfirmationModal
        isOpen={showDeleteAllElectionsModal}
        onClose={() => setShowDeleteAllElectionsModal(false)}
        onConfirm={deleteAllElections}
        title="Delete All Elections"
        description={`Are you absolutely sure you want to delete ALL ${statistics?.elections?.total || 0} elections? This will remove all election data including candidates and cannot be undone.`}
        confirmText="Delete All Elections"
        confirmColor="red"
        isLoading={isDeletingElections}
      />

      <ConfirmationModal
        isOpen={showDeleteAllVotesModal}
        onClose={() => setShowDeleteAllVotesModal(false)}
        onConfirm={deleteAllVotes}
        title="Delete All Votes"
        description={`Are you absolutely sure you want to delete ALL ${statistics?.votes?.total || 0} votes? This will reset voting status for all users and cannot be undone.`}
        confirmText="Delete All Votes"
        confirmColor="red"
        isLoading={isDeletingVotes}
      />

      <ConfirmationModal
        isOpen={showDeleteEverythingModal}
        onClose={() => setShowDeleteEverythingModal(false)}
        onConfirm={deleteEverything}
        title="Delete Everything - Nuclear Option"
        description="WARNING: This will permanently delete ALL data from the system - users, candidates, elections, and votes. This action cannot be undone and will completely reset the system. Only the current admin account will be preserved."
        confirmText="Delete Everything"
        confirmColor="red"
        isLoading={isDeletingEverything}
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
      <div className="fixed inset-0 backdrop-blur-[10px] bg-opacity-50 transition-opacity" onClick={onClose}></div>

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

export default ManagerSettings;