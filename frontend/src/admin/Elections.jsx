/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Loading from '../layout/Loading';
import toast from 'react-hot-toast'
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { set } from 'mongoose';
const Elections = () => {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [error, setError] = useState('');
const [activeAction, setActiveAction] = useState({ id: null, type: null });

const [isSubmitting, setIsSubmitting] = useState(false);
  // Load elections from database
  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/elections');
        
        // Handle different response structures
        let electionsData = [];
        
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          electionsData = response.data;
        } else if (response.data.elections && Array.isArray(response.data.elections)) {
          // If response.data has an elections property that's an array
          electionsData = response.data.elections;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that's an array
          electionsData = response.data.data;
        } else {
          console.warn('Unexpected API response structure:', response.data);
          electionsData = [];
        }
        
        setElections(electionsData);
        // console.log('Loaded elections:', electionsData);
      } catch (error) {
        // console.error('Error fetching elections:', error);
        toast.error(error.response?.data?.message || 'Failed to load elections')
        // setError('Failed to load elections');
        // Fallback to empty array
        setElections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElections();
  }, []);

  const refreshElection = async () => {
  setIsLoading(true);
      try {
        const response = await axios.get('/api/elections');
        
        // Handle different response structures
        let electionsData = [];
        
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          electionsData = response.data;
        } else if (response.data.elections && Array.isArray(response.data.elections)) {
          // If response.data has an elections property that's an array
          electionsData = response.data.elections;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that's an array
          electionsData = response.data.data;
        } else {
          console.warn('Unexpected API response structure:', response.data);
          electionsData = [];
        }
        
        setElections(electionsData);
        // console.log('Loaded elections:', electionsData);
      } catch (error) {
        // console.error('Error fetching elections:', error);
        toast.error(error.response?.data?.message || 'Failed to load elections')
        // setError('Failed to load elections');
        // Fallback to empty array
        setElections([]);
      } finally {
        setIsLoading(false);
      }
  }
  // Filter elections based on active tab
  useEffect(() => {
    if (!Array.isArray(elections)) {
      setFilteredElections([]);
      return;
    }

    let filtered = [];
    switch (activeTab) {
      case 'active':
        filtered = elections.filter(election => election.status === 'active');
        break;
      case 'upcoming':
        filtered = elections.filter(election => election.status === 'upcoming');
        break;
      case 'completed':
        filtered = elections.filter(election => election.status === 'completed');
        break;
      default:
        filtered = elections;
    }
    setFilteredElections(filtered);
  }, [elections, activeTab]);

  // Election actions
  const handleCreateElection = () => {
    setSelectedElection(null);
    setShowElectionModal(true);
  };

  const handleEditElection = (election) => {
    setSelectedElection(election);
    setShowElectionModal(true);
  };

  const handleDeleteElection = (election) => {
    setSelectedElection(election);
    setShowDeleteModal(true);
  };

  const handleStartElection = async (electionId) => {
    try {
  setActiveAction({ id: electionId, type: 'start' });
      // setIsSubmitting(true)
      await axios.put(`/api/elections/${electionId}/start`); 
      // Refresh elections
      const response = await axios.get('/api/elections');
      setElections(response.data.elections || response.data || []);
    } catch (error) {
      // console.error('Error starting election:', error);
  
      toast.error(error.response.data.message)
    }finally{
       setActiveAction({ id: null, type: null });
      // setIsSubmitting(false)
    }
  };

  const handleEndElection = async (electionId) => {
    setActiveAction({ id: electionId, type: 'end' });

    try {
      await axios.put(`/api/elections/${electionId}/end`);
      // Refresh elections
      const response = await axios.get('/api/elections');
      setElections(response.data.elections || response.data || []);
    } catch (error) {
      // console.error('Error ending election:', error);
      toast.error(error.response.data.message || 'Failed to end election')
      // setError('Failed to end election');
    }finally{
             setActiveAction({ id: null, type: null });

    }
  };
  const handleHideElection = async (electionId) => {
  setActiveAction({ id: electionId, type: 'hide' });
   
    try {
      await axios.put(`/api/elections/${electionId}/hide`);
      // Refresh elections
      const response = await axios.get('/api/elections');
      setElections(response.data.elections || response.data || []);
    } catch (error) {
      // console.error('Error ending election:', error);
      toast.error(error.response.data.message || 'Failed to hide election')
      // setError('Failed to end election');
    }finally{
           setActiveAction({ id: null, type: null });

    }
  };

  const handlePublishResults = async (electionId) => {
     setActiveAction({ id: electionId, type: 'publish' });

    try {
      await axios.put(`/api/elections/${electionId}/publish`);
      // Refresh elections
      const response = await axios.get('/api/elections');
      setElections(response.data.elections || response.data || []);
    } catch (error) {
      // console.error('Error publishing results:', error);
      toast.error(error.response.data.message || 'Failed to publish results')
      // setError('Failed to publish results');
    }finally{
          setActiveAction({ id: null, type: null });

    }
  };

  const confirmDeleteElection = async () => {
    if (selectedElection) {
      setIsSubmitting(true);
       setActiveAction({ id: selectedElection._id, type: 'delete' });

      try {
        await axios.delete(`/api/elections/${selectedElection._id || selectedElection.id}`);
        // Refresh elections
        const response = await axios.get('/api/elections');
        setElections(response.data.elections || response.data || []);
        setShowDeleteModal(false);
        toast.success('successfuly deleted')
        setSelectedElection(null);
      } catch (error) {
        // console.error('Error deleting election:', error);
        toast.error(error.response.data.message || 'Failed to delete election')
        // setError('Failed to delete election');
      }finally{
        setIsSubmitting(false)
           setActiveAction({ id: null, type: null });

      }
    }
  };

  const handleSaveElection = async (electionData) => {
    try {
      setIsSubmitting(true);
      if (selectedElection) {
        // Update existing election
        await axios.put(`/api/elections/${selectedElection._id || selectedElection.id}`, electionData);
      } else {
        // Create new election
        await axios.post('/api/elections', electionData);
      }
      
      // Refresh elections from backend
      const response = await axios.get('/api/elections');
      setElections(response.data.elections || response.data || []);
      setShowElectionModal(false);
      setSelectedElection(null);
    } catch (error) {
      // console.error('Error saving election:', error);
      toast.error(error.response.data.message || 'Failed to save election')
      // setError('Failed to save election');
    }finally {
      setIsSubmitting(false);
    } 
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      upcoming: { color: 'bg-blue-100 text-blue-800', label: 'Upcoming' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getParticipationRate = (election) => {
    if (!election || election.totalVoters === 0) return 0;
    return ((election.totalVotes / election.totalVoters) * 100).toFixed(1);
  };

  // Safe array access for counts
  const getElectionCount = (status) => {
    if (!Array.isArray(elections)) return 0;
    if (status === 'all') return elections.length;
    return elections.filter(e => e.status === status).length;
  };

  // 🔄 Show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
          <p className="text-gray-600 font-medium">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Election Management</h1>
              <p className="mt-2 text-gray-600">Create and manage elections</p>
            </div>
            <div className='flex items-center gap-1'>
              <button
              onClick={handleCreateElection}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Election
            </button>
             {/* Refresh Button */}
                        <div className="self-end">
                          <button
                            onClick={refreshElection}
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                          </button>
                        </div>
            </div>
            
          </div>
        </div>

{/* Tabs */}
<div className="bg-white rounded-lg shadow mb-8">
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex overflow-x-auto scrollbar-hide">
      {[
        { id: 'active', name: 'Active Elections', count: getElectionCount('active') },
        { id: 'upcoming', name: 'Upcoming Elections', count: getElectionCount('upcoming') },
        { id: 'completed', name: 'Completed Elections', count: getElectionCount('completed') },
        { id: 'all', name: 'All Elections', count: getElectionCount('all') },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center whitespace-nowrap py-3 px-4 sm:py-4 sm:px-6 border-b-2 font-medium text-sm transition-all duration-150 ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span>{tab.name}</span>
          <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
            {tab.count}
          </span>
        </button>
      ))}
    </nav>
  </div>
</div>


        {/* Elections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(filteredElections) && filteredElections.map((election) => (
            <div key={election._id || election.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
                  {getStatusBadge(election.status)}
                </div>
                <p className="text-gray-600 text-sm">{election.description}</p>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <UserGroupIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900">{election.totalCandidates || 0}</div>
                    <div className="text-xs text-gray-500">Candidates</div>
                  </div>
                  <div className="text-center">
                    <ChartBarIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900">{election.totalVotes || 0}</div>
                    <div className="text-xs text-gray-500">Votes</div>
                  </div>
                </div>

                {/* Participation */}
                {election.status === 'completed' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Participation</span>
                      <span className="font-medium">{getParticipationRate(election)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${getParticipationRate(election)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>
                      {election.startDate ? new Date(election.startDate).toLocaleDateString() : 'N/A'} - {' '}
                      {election.endDate ? new Date(election.endDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {election.resultsPublished && (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      <span>Results Published</span>
                    </div>
                  )}
                </div>
              </div>

          {/* Actions */}
<div className="px-6 py-4 bg-gray-50 rounded-b-lg">
  <div className="flex justify-between space-x-2">
    {/* View Results */}
    {election.status === 'completed' && election.resultsPublished && (
      <button
        onClick={() => window.location.href = `/results`}
        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700"
      >
        View Results
      </button>
    )}

    {/* Start Election */}
    {election.status === 'upcoming' && (
      <button
        disabled={activeAction.id !== null}
        onClick={() => handleStartElection(election._id || election.id)}
        className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {activeAction.id === election._id && activeAction.type === 'start'
          ? <Loading/>
          : <><PlayIcon className="h-4 w-4 mr-1" /> Start</>}
      </button>
    )}

    {/* End Election */}
    {election.status === 'active' && (
      <button
        disabled={activeAction.id !== null}
        onClick={() => handleEndElection(election._id || election.id)}
        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {activeAction.id === election._id && activeAction.type === 'end'
          ? <Loading/>
          : <><StopIcon className="h-4 w-4 mr-1" /> End</>}
      </button>
    )}
    
    {/* Hide Election */}
    {election.status === 'completed' && election.resultsPublished && (
      <button
        disabled={activeAction.id !== null}
        onClick={() => handleHideElection(election._id || election.id)}
        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {activeAction.id === election._id && activeAction.type === 'hide'
          ? <Loading/>
          : <><EyeIcon className="h-4 w-4 mr-1" /> Hide</>}
      </button>
    )}

    {/* Publish Results */}
    {election.status === 'completed' && !election.resultsPublished && (
      <button
        disabled={activeAction.id !== null}
        onClick={() => handlePublishResults(election._id || election.id)}
        className="flex-1 bg-purple-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {activeAction.id === election._id && activeAction.type === 'publish'
          ? <Loading/>
          : 'Publish Result'}
      </button>
    )}

    {/* Action Buttons */}
    <div className="flex space-x-1">
      {election.totalVoters > 0 ? '' : (
        <button
          onClick={() => handleEditElection(election)}
          disabled={activeAction.id !== null}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit Election"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      )}
      <button
        disabled={activeAction.id !== null}
        onClick={() => handleDeleteElection(election)}
        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete Election"
      >
        {activeAction.id === election._id && activeAction.type === 'delete'
          ? <Loading/>
          : <TrashIcon className="h-4 w-4" />}
      </button>
    </div>
  </div>
</div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!Array.isArray(filteredElections) || filteredElections.length === 0) && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab !== 'all' ? activeTab : ''} elections found
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'active' && 'There are no active elections at the moment.'}
              {activeTab === 'upcoming' && 'No upcoming elections scheduled.'}
              {activeTab === 'completed' && 'No completed elections yet.'}
              {activeTab === 'all' && 'No elections have been created yet.'}
            </p>
            <button
              onClick={handleCreateElection}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Election
            </button>
          </div>
        )}

        {/* Election Modal */}
        {showElectionModal && (
          <ElectionModal
            election={selectedElection}
            isSubmitting={isSubmitting}
            onClose={() => {
              setShowElectionModal(false);
              setSelectedElection(null);
            }}
            onSave={handleSaveElection}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedElection && (
          <DeleteConfirmationModal
            election={selectedElection}
            isSubmitting={isSubmitting}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedElection(null);
            }}
            // activeElection={activeElection}
            onConfirm={confirmDeleteElection}
          />
        )}
      </div>
    </div>
  );
};

// Election Modal Component (keep the same as your original)
const ElectionModal = ({ election, onClose, onSave,isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: election?.title || '',
    description: election?.description || '',
    startDate: election?.startDate || '',
    endDate: election?.endDate || ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = 'Title is required';
    if (!formData.description.trim()) validationErrors.description = 'Description is required';
    if (!formData.startDate) validationErrors.startDate = 'Start date is required';
    if (!formData.endDate) validationErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      validationErrors.endDate = 'End date must be after start date';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-[10px] bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {election ? 'Edit Election' : 'Create New Election'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Election Title</label>
                <input
                  type="text"
                  name="title"
                  disabled={isSubmitting}
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border p-2 ${
                    errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter election title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  disabled={isSubmitting} 
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border p-2 ${
                    errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Describe the purpose of this election"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    disabled={isSubmitting}
                    value={formData.startDate}
                     min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
// min={new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.startDate ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    disabled={isSubmitting}
                    value={formData.endDate}
                    //  min={new Date(formData.startDate ? '':'' ).toISOString().split('T')[0]}
                    min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.endDate ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
         {isSubmitting 
  ? <Loading/> 
  : election 
    ? "Update Election" 
    : "Create Election"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal (keep the same as your original)
const DeleteConfirmationModal = ({ election, onClose,onConfirm,isSubmitting }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0  backdrop-blur-[10px] bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Delete Election
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{election.title}"? This action cannot be undone and will remove all associated data such as candidates and votes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={onConfirm}
              disabled={ isSubmitting} 
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isSubmitting? <Loading/> : 'Delete'}
            </button>
            <button
            disabled={isSubmitting }
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elections;