/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { 
  XMarkIcon,
  UserCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Loading from '../../layout/Loading';
import toast from 'react-hot-toast';

const AddCandidatesModal = ({ isOpen, candidates, setCandidates, onClose, editCandidate = null }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elections, setElections] = useState([]);
  const [isLoadingElections, setIsLoadingElections] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const isEditMode = Boolean(editCandidate);
  
  // Reset form when modal opens/closes or when editCandidate changes
  useEffect(() => {
    if (isOpen) {
      fetchElections();
      if (editCandidate) {
        // Pre-fill form for edit mode and set image preview
        setImagePreview(editCandidate.thumbnail || null);
        setSelectedFile(null);
        setErrors({});
      } else {
        // Reset for new candidate
        setImagePreview(null);
        setSelectedFile(null);
      }
    }
  }, [isOpen, editCandidate]);

  const fetchElections = async () => {
    setIsLoadingElections(true);
    try {
      const response = await axios.get('/api/elections');
      
      let electionsData = [];
      
      if (Array.isArray(response.data)) {
        electionsData = response.data;
      } else if (response.data.elections && Array.isArray(response.data.elections)) {
        electionsData = response.data.elections;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        electionsData = response.data.data;
      }
      
      const upcomingElections = electionsData.filter(election => 
        election.status === 'upcoming' || election.status === 'active'
      );
      
      setElections(upcomingElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setErrors(prev => ({ ...prev, elections: 'Failed to load elections' }));
    } finally {
      setIsLoadingElections(false);
    }
  };

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.get("name")?.trim()) newErrors.name = 'Name is required';
    if (!formData.get("party")) newErrors.party = 'Party is required';
    if (!formData.get("course")) newErrors.course = 'Course is required';
    if (!formData.get("year")) newErrors.year = 'Year is required';
    if (!formData.get("bio")?.trim()) newErrors.bio = 'Bio is required';
    if (formData.get("bio")?.length > 200) newErrors.bio = 'Bio must be less than 200 characters';
    if (!formData.get("manifesto")?.trim()) newErrors.manifesto = 'Manifesto is required';
    if (formData.get("manifesto")?.length > 300) newErrors.manifesto = 'Manifesto must be less than 300 characters';
    
    // Only require image for new candidates, not for edits
    if (!isEditMode && !selectedFile) {
      newErrors.thumbnail = 'Image is required';
    }
    
    if (!isEditMode && !formData.get("election")) {
      newErrors.election = 'Please select an election';
    }

    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, thumbnail: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, thumbnail: 'Image size should be less than 5MB' }));
        return;
      }

      // Clear any previous thumbnail errors
      setErrors(prev => ({ ...prev, thumbnail: '' }));

      // Store the file for submission
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    setSelectedFile(null);
    // Clear the file input
    const fileInput = document.querySelector('input[name="thumbnail"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Manual FormData construction to ensure correct field names
  const formData = new FormData();

  // Add text fields
  formData.append('name', e.target.name.value);
  formData.append('party', e.target.party.value);
  formData.append('course', e.target.course.value);
  formData.append('year', e.target.year.value);
  formData.append('bio', e.target.bio.value);
  formData.append('manifesto', e.target.manifesto.value);

  // Only append election for new candidates
  if (!isEditMode && e.target.election) {
    formData.append('election', e.target.election.value);
  }

  // CRITICAL: Only append thumbnail if a file is selected
  // Use the exact same field name as in Multer config
  if (selectedFile) {
    formData.append('thumbnail', selectedFile); // Must match 'thumbnail' in upload.single('thumbnail')
  }

 

  const formErrors = validateForm(formData);
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  setIsSubmitting(true);
  try {
    let response;
    
    if (isEditMode) {
      // Update existing candidate
      const candidateId = editCandidate._id;
      response = await axios.put(`/api/candidates/${candidateId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update candidate in state
      const updatedCandidates = candidates.map(candidate =>
        candidate._id === candidateId ? response.data : candidate
      );
      setCandidates(updatedCandidates);
      
      toast.success('Candidate updated successfully!');
    } else {
      // Add new candidate
      const electionId = formData.get("election");
      response = await axios.post(`/api/candidates/${electionId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setCandidates([...candidates, response.data]);
      toast.success('Candidate added successfully!');
    }

    handleClose();
  } catch (error) {
    console.error(`Error ${isEditMode ? 'updating' : 'adding'} candidate:`, error);
    const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} candidate. Please try again.`;
    toast.error(errorMessage);
    setErrors(prev => ({ 
      ...prev, 
      submit: errorMessage 
    }));
  } finally {
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    setErrors({});
    setImagePreview(null);
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-[10px] bg-opacity-50 transition-opacity" onClick={handleClose}></div>

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          
          {/* Header */}
          <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode ? 'Edit Candidate' : 'Add New Candidate'}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" encType="multipart/form-data">
            <div className="space-y-6">
              {/* Election Selection - Only show for new candidates */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assign to Election *
                  </label>
                  <select
                    name="election"
                    className={`mt-1 block w-full rounded-md border p-2 ${
                      errors.election ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    disabled={isLoadingElections || isSubmitting}
                    defaultValue=""

                  >
                    <option value="">Select an election</option>
                    {elections.map((election) => (
                      <option key={election._id || election.id} value={election._id || election.id}>
                        {election.title} ({election.status})
                      </option>
                    ))}
                  </select>
                  {errors.election && (
                    <p className="mt-1 text-sm text-red-600">{errors.election}</p>
                  )}
                  {isLoadingElections && (
                    <p className="mt-1 text-sm text-gray-500">Loading elections...</p>
                  )}
                  {!isLoadingElections && elections.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">No upcoming elections available</p>
                  )}
                </div>
              )}

              {/* Image Upload with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Candidate Photo {!isEditMode && '*'}
                </label>
                
                {/* Image Preview */}
                {(imagePreview || (isEditMode && editCandidate?.thumbnail)) && (
                  <div className="mt-2 mb-4 relative">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || editCandidate.thumbnail}
                        alt="Candidate preview"
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImagePreview}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {imagePreview ? 'New image selected' : 'Current image'}
                    </p>
                  </div>
                )}

                {/* File Input */}
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  errors.thumbnail ? 'border-red-300' : 'border-gray-300'
                }`}>
                  <div className="space-y-1 text-center">
                    {!imagePreview && !editCandidate?.thumbnail ? (
                      <>
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a photo</span>
                            <input
                              id="thumbnail"
                              name="thumbnail"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    ) : (
                      <div className="text-center">
                        <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Change photo</span>
                          <input
                            id="thumbnail"
                            disabled={isSubmitting}
                            name="thumbnail"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
                )}
                
                {isEditMode && !imagePreview && (
                  <p className="mt-1 text-sm text-gray-500">
                    Leave empty to keep current photo
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  disabled={isSubmitting} 
                  name="name"
                  defaultValue={isEditMode ? editCandidate.name : ''}
                  className={`mt-1 block w-full rounded-md border p-2 ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter candidate's full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Party */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Political Party *
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  name="party"
                  defaultValue={isEditMode ? editCandidate.party : ''}
                  className={`mt-1 block w-full rounded-md border p-2 ${
                    errors.party ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter candidate's party"
                />
                {errors.party && <p className="mt-1 text-sm text-red-600">{errors.party}</p>}
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course/Program *
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  name="course"
                  defaultValue={isEditMode ? editCandidate.course : ''}
                  className={`mt-1 block w-full rounded-md border p-2 ${
                    errors.course ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="Enter candidate's course"
                />
                {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Academic Year *
                </label>
                <select
                  name="year"
                  disabled={isSubmitting}
                  defaultValue={isEditMode ? editCandidate.year : ''}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Bio *
                </label>
                <textarea
                  name="bio"
                  disabled={isSubmitting}
                  rows={3}
                  maxLength={200}
                  defaultValue={isEditMode ? editCandidate.bio : ''}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Brief description (max 200 characters)"
                />
                {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
              </div>

              {/* Manifesto */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manifesto Summary *
                </label>
                <textarea
                  name="manifesto"
                  rows={3}
                  disabled={isSubmitting}
                  maxLength={300}
                  defaultValue={isEditMode ? editCandidate.manifesto : ''}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Candidate's manifesto summary (max 300 characters)"
                />
                {errors.manifesto && <p className="mt-1 text-sm text-red-600">{errors.manifesto}</p>}
              </div>

              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
              >
                {isSubmitting ? <Loading/> : (isEditMode ? 'Update Candidate' : 'Add Candidate')}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidatesModal;