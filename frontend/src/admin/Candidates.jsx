/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  UserCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import AddCandidateModal from './models/AddCandidatesModal';
import axios from 'axios';
import Loading from '../layout/Loading';
import LoadingPopup from '../layout/LoadingPopup';

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  
  // Modal states for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load candidates from database
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/candidates');
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.candidates || [];
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Get unique parties for filter
  const parties = ['all', ...new Set(candidates.map(candidate => candidate.party))];

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesParty = selectedParty === 'all' || candidate.party === selectedParty;
      return matchesSearch && matchesParty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'votes':
          return b.votes - a.votes;
        case 'year':
          return a.year.localeCompare(b.year);
        default:
          return 0;
      }
    });

  const refreshCandidates = () => {
    setIsLoading(true);
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/candidates');
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.candidates || [];
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleAddCandidate = () => {
    setEditingCandidate(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCandidate(null);
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (candidate) => {
    setCandidateToDelete(candidate);
    setShowDeleteModal(true);
  };

  const handleDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/candidates/${candidateToDelete._id}`);
      const updatedCandidates = candidates.filter(candidate => candidate._id !== candidateToDelete._id);
      setCandidates(updatedCandidates);
      setShowDeleteModal(false);
      setCandidateToDelete(null);
    } catch (error) {
      console.log('Error deleting candidate:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCandidateToDelete(null);
  };

  // 🔄 Show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
          <p className="text-gray-600 font-medium">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
              <p className="mt-2 text-gray-600">Meet the candidates running in the 2023 Student Election</p>
            </div>
            <button 
              onClick={handleAddCandidate}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <ButtonLoadingSpinner />
              ) : (
                <PlusIcon className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Loading...' : 'Add Candidate'}
            </button>
            <AddCandidateModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              editCandidate={editingCandidate}
              candidates={candidates}
              setCandidates={setCandidates}
            />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search candidates by name, course, or bio..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Party Filter */}
            <div className="w-full md:w-48">
              <label htmlFor="party" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Party
              </label>
              <select
                id="party"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
              >
                {parties.map(party => (
                  <option key={party} value={party}>
                    {party === 'all' ? 'All Parties' : party}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="w-full md:w-48">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="votes">Votes</option>
                <option value="year">Year</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="self-end">
              <button
                onClick={refreshCandidates}
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
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </p>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Filters active</span>
          </div>
        </div>

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedParty('all');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
                {/* Candidate Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  <img
                    className="w-full h-full object-cover"
                    src={candidate.thumbnail || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={candidate.name}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {candidate.party}
                    </span>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-500">{candidate.course} • {candidate.year}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600">
                        <HeartIcon className="h-5 w-5 mr-1" />
                        <span className="font-bold">{candidate.votes || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">votes</p>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600 line-clamp-2 truncate">{candidate.bio}</p>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Manifesto</h4>
                    <p className="text-sm text-gray-500 line-clamp-2 px-2 truncate">{candidate.manifesto}</p>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 flex space-x-4">
                    <a href={candidate.social?.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                      </svg>
                    </a>
                    <a href={candidate.social?.instagram} className="text-gray-400 hover:text-pink-600 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                    <a href={candidate.social?.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-3">
                    <button 
                      onClick={() => handleViewCandidate(candidate)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ButtonLoadingSpinner size="small" />
                      ) : (
                        <EyeIcon className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? 'Loading...' : 'View'}
                    </button>
                    <button
                      onClick={() => handleEditCandidate(candidate)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ButtonLoadingSpinner size="small" />
                      ) : (
                        <PencilIcon className="h-5 w-5 mx-auto" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(candidate)}
                      disabled={isLoading || isDeleting}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading || isDeleting ? (
                        <ButtonLoadingSpinner size="small" />
                      ) : (
                        <TrashIcon className="h-5 w-5 mx-auto" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredCandidates.length > 6 && (
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Load More Candidates
            </button>
          </div>
        )}
      </div>

      {/* View Candidate Modal */}
      {isViewModalOpen && selectedCandidate && (
        <ViewCandidateModal
          candidate={selectedCandidate}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCandidate}
        candidate={candidateToDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, candidate, isLoading }) => {
  if (!isOpen) return null;

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
                  Delete Candidate
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete <strong>{candidate?.name}</strong>? This action cannot be undone and all associated data will be permanently removed.
                  </p>
                  {candidate?.votes > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                      <p className="text-sm text-yellow-700">
                        <strong>Warning:</strong> This candidate has {candidate.votes} votes that will be lost.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <ButtonLoadingSpinner />
                  <span className="ml-2">Deleting...</span>
                </div>
              ) : (
                'Delete Candidate'
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

// View Candidate Modal Component - Minimalist Advanced Design
const ViewCandidateModal = ({ candidate, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Subtle Backdrop */}
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-all duration-300" onClick={onClose}></div>

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 sm:my-8 sm:w-full sm:max-w-4xl">
          
          {/* Minimal Header */}
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <UserCircleIcon className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Candidate Profile</h3>
                  <p className="text-sm text-gray-500 mt-1">Detailed information and manifesto</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-6 sm:p-8">
            {/* Profile Overview */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Profile & Stats */}
              <div className="lg:w-2/5 space-y-6">
                {/* Profile Card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                        src={candidate.thumbnail || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={candidate.name}
                      />
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">{candidate.name}</h1>
                    
                    {/* Key Metrics */}
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Party</span>
                        <span className="text-sm text-gray-900 font-semibold">{candidate.party}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Course</span>
                        <span className="text-sm text-gray-900">{candidate.course}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Year</span>
                        <span className="text-sm text-gray-900">{candidate.year}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Vote Count</span>
                        <span className="text-lg font-bold text-gray-900">{candidate.votes || 0}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-800 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((candidate.votes || 0) / 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Engagement Score (Example) */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Engagement</span>
                        <span className="text-sm font-semibold text-gray-900">High</span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-full bg-gray-800 h-1 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="lg:w-3/5 space-y-6">
                {/* Bio Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-6 bg-gray-800 rounded-full mr-3"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Professional Background</h4>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {candidate.bio}
                    </p>
                  </div>
                </div>

                {/* Manifesto Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-6 bg-gray-800 rounded-full mr-3"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Vision & Manifesto</h4>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {candidate.manifesto}
                    </p>
                  </div>
                  
                  {/* Key Points (Extracted from manifesto) */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Key Focus Areas</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {candidate.manifesto.split('. ').slice(0, 4).map((point, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{point.trim()}.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social & Contact */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-6 bg-gray-800 rounded-full mr-3"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Connect</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {candidate.social?.twitter && candidate.social.twitter !== '#' && (
                      <a 
                        href={candidate.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                        </svg>
                        Twitter
                      </a>
                    )}
                    {candidate.social?.instagram && candidate.social.instagram !== '#' && (
                      <a 
                        href={candidate.social.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                        Instagram
                      </a>
                    )}
                    {candidate.social?.linkedin && candidate.social.linkedin !== '#' && (
                      <a 
                        href={candidate.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                  {(!candidate.social?.twitter || candidate.social.twitter === '#') && 
                   (!candidate.social?.instagram || candidate.social.instagram === '#') && 
                   (!candidate.social?.linkedin || candidate.social.linkedin === '#') && (
                    <p className="text-sm text-gray-500 italic mt-3">No social links provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Footer */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">
                  Candidate ID: <span className="font-mono text-gray-700">{candidate._id?.slice(-8)}</span>
                </p>
              </div>
              <div className="flex space-x-3 justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Loading Spinner Component for Buttons
const ButtonLoadingSpinner = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'h-3 w-3 border-2',
    default: 'h-4 w-4 border-2'
  };

  return (
    <div className={`animate-spin rounded-full border-white border-t-transparent ${sizeClasses[size]}`}></div>
  );
};

export default Candidates;