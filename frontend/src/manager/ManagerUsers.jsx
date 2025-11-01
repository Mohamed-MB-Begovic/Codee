import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  UserIcon,
  AcademicCapIcon,
  PrinterIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { FiMoreVertical, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import Loading from '../layout/Loading'
const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const PrintTable = () => (
    <div className="bg-white p-6 rounded-lg print:p-0 print:bg-transparent">
      <div className="mb-6 print:mb-4">
        <h1 className="text-2xl font-bold text-gray-900 print:text-xl">EduVote System Users</h1>
        <p className="text-sm text-gray-600 print:text-xs">
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        <p className="text-sm text-gray-600 print:text-xs">
          Total Users: {filteredUsers?.length}
        </p>
      </div>

      <div className="overflow-x-auto print:overflow-visible">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 print:border print:border-gray-300">
          <thead className="bg-gray-50 print:bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                User Information
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2 truncate">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                Password
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers?.map((user, index) => (
              <tr 
                key={user._id} 
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-gray-100'}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-600 text-xs print:text-2xs">ID: {user?.studentId || 'N/A'}</div>
                  {user.email && (
                    <div className="text-gray-600 text-xs print:text-2xs truncate">{user.email}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 print:bg-purple-200' 
                      : 'bg-blue-100 text-blue-800 print:bg-blue-200'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Student'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                  <div className="font-medium">{user?.email || 'N/A'}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                  <div className="font-medium">{user?.password || 'N/A'}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 print:border-r print:border-gray-300 print:px-3 print:py-2">
                  <div className="font-medium">{user?.status || 'N/A'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 print:text-2xs print:mt-4 print:pt-2">
        <p>EduVote System - Confidential User Report</p>
        <p>Page 1 of 1</p>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 1cm;
            size: portrait;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            padding: 6px !important;
            border: 1px solid #d1d5db !important;
          }
          .print\\:bg-transparent {
            background: transparent !important;
          }
          .print\\:bg-gray-100 {
            background: #f3f4f6 !important;
          }
          .print\\:bg-purple-200 {
            background: #e9d5ff !important;
          }
          .print\\:bg-blue-200 {
            background: #bfdbfe !important;
          }
          .print\\:text-2xs {
            font-size: 0.625rem;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:px-3 {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          .print\\:mt-4 {
            margin-top: 1rem !important;
          }
          .print\\:pt-2 {
            padding-top: 0.5rem !important;
          }
          .print\\:border {
            border-width: 1px !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
        }
      `}</style>
    </div>
  );

  const printUsers = () => {
    const printArea = document.getElementById('print-users-table-area');
    const printContents = printArea.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=900');
    printWindow.document.write('<html><head><title>Print Users</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  useEffect(() => {
    const fetchUsers = async () => {

      setIsLoading(true);
      try {
         const response = await axios.get('/api/users/manager/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error loading users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);


  useEffect(() => {
    let filtered = [...users];

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        (user.studentId && user.studentId.toLowerCase().includes(term))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(user => user.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, typeFilter, statusFilter]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map(user => user._id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedUserIds.length} selected users? This cannot be undone.`)) return;
    try {
      await Promise.all(selectedUserIds.map(id => axios.delete(`/api/users/${id}`)));
      const updatedUsers = users.filter(user => !selectedUserIds.includes(user._id));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setSelectedUserIds([]);
      toast.success('Users deleted successfully');
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Error deleting users');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
 
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  const [isSubmitting,setIsSubmitting]=useState(false)
  const confirmDeleteUser = async () => {
    if (selectedUser) {
      setIsSubmitting(true)
      try {
        await axios.delete(`/api/users/${selectedUser._id}`);
        const updatedUsers = users.filter(user => user._id !== selectedUser._id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowDeleteModal(false);
        setSelectedUser(null);
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }finally{
        setIsSubmitting(false)
      }
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await axios.put(`/api/users/${userId}`, { status });
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, status } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowActionsMenu(null);
      toast.success(`User ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error updating user status');
    }
  };
 
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleSaveUser = async (userData) => {
    setModalLoading(true);
    try {
      if (selectedUser) {
        await axios.put(`/api/users/${selectedUser._id}`, userData);
        toast.success('User updated successfully');
      } else {
        // console.log(userData)
        await axios.post('/api/users/manager', userData);
        toast.success('User created successfully');
      }
      
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      // console.error('Error saving user:', error);
      if(error.response?.data?.errorResponse?.code===11000){
        return toast.error(`this ${userData.email} email already exists`)
      }
      toast.error(error.response?.data?.message || 'Error saving user');
    } finally {
      setModalLoading(false);
    }
  };

  const refreshUsers = () => {
    setIsLoading(true);
    const fetchUsers = async () => {
   try {
        const response = await axios.get('/api/users/manager/users');
         
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error loading users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  };

  const actionsMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(e.target)
      ) {
        setShowActionsMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleActionsMenu = (userId, e) => {
    if (e) e.stopPropagation();
    setShowActionsMenu(showActionsMenu === userId ? null : userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-gray-600">Manage admin and moderator accounts</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddUser}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Add User
              </button>

              <button
                onClick={printUsers}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Print Users"
              >
                <PrinterIcon className="h-5 w-5 mr-2" />
                Print Users
              </button>

              <button
                onClick={handleBulkDelete}
                disabled={selectedUserIds.length === 0}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition ${
                  selectedUserIds.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
                title="Delete Selected"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete Selected
              </button>

              <button
                onClick={refreshUsers}
                disabled={isLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or ID..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="school">School</option>
                <option value="university">University</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="deactivated">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full bg-white">
            <thead className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-medium">
              {filteredUsers?.length  === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.studentId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "superadmin"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <>
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            Administrator
                          </>
                        ) : user.role === "superadmin" ? (
                          <>
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            Super Admin
                          </>
                        ) : (
                          <>
                            <AcademicCapIcon className="h-3 w-3 mr-1" />
                            Student
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      user.type === "school"
        ? "bg-blue-100 text-blue-800"
        : user.type === "university"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {user.type === "school" ? (
      <>
        <BuildingLibraryIcon className="h-3 w-3 mr-1" />
        School
      </>
    ) : user.type === "university" ? (
      <>
        <AcademicCapIcon className="h-3 w-3 mr-1" />
        University
      </>
    ) : (
      <>
        <HomeIcon className="h-3 w-3 mr-1" />
        Other
      </>
    )}
  </span>
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {user.password || "N/A"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        // onClick={() => handleStatusToggle(user._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        } transition-colors`}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                <td className="py-4 px-6 text-center text-sm font-medium">
                  <div className="relative inline-block actions-menu">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionsMenu(user._id);
                      }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FiMoreVertical className="h-5 w-5" />
                    </button>

                    {showActionsMenu === user._id && (
                      <div
                        className={`absolute right-0 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 ${
                          filteredUsers.length > 5 &&
                          filteredUsers.length - index < 3
                            ? 'bottom-full mb-2'
                            : 'mt-2'
                        }`}
                      >
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(user._id, 'active');
                              setShowActionsMenu(null);
                            }}
                            disabled={user.status === 'active'}
                            className={`flex items-center w-full px-4 py-2 text-sm ${
                              user.status === 'active'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <FiCheck className="mr-2 text-green-500" />
                            Activate
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(user._id, 'deactivated');
                              setShowActionsMenu(null);
                            }}
                            disabled={user.status === 'deactivated'}
                            className={`flex items-center w-full px-4 py-2 text-sm ${
                              user.status === 'deactivated'
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <FiX className="mr-2 text-red-500" />
                            Deactivate
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleDelete(user._id);
                              setShowActionsMenu(null);
                              handleDeleteUser(user);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FiTrash2 className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showUserModal && (
          <UserModal
            user={selectedUser}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
            onSave={handleSaveUser}
            loading={modalLoading}
          />
        )}

        {showDeleteModal && selectedUser && (
          <DeleteConfirmationModal
            user={selectedUser}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUser(null);
            }}
            isSubmitting={isSubmitting}
            onConfirm={confirmDeleteUser}
          />
        )}

        <div id="print-users-table-area" style={{ display: 'none' }}>
          <PrintTable />
        </div>
      </div>
    </div>
  );
};

const UserModal = ({ user, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || 'admin',
    email: user?.email || '',
    type:user?.type || 'university'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-[10px] bg-opacity-50 transition-opacity" onClick={onClose}></div>      
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {user ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  {/* <option value="student">Student</option> */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="university">University</option>
                  <option value="school">School</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    user ? 'Update User' : 'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ user, onClose, onConfirm,isSubmitting }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-[10px] bg-opacity-50 transition-opacity" onClick={onClose}></div>            
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Delete User
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {user.name}? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isSubmitting ?<Loading/> :'Delete'}
            </button>
            <button
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

export default ManagerUsers;