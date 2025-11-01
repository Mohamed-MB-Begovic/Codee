/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { 
  ChartBarIcon,
  BellIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ManagerHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user,logOut,refreshUser } = useUser();
  const navigate=useNavigate()
useEffect(() => {
  refreshUser(); // ✅ always get the latest user info on load
}, []);
  if (!user || user.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center"> 
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-lg text-gray-700">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', path: '/manager', icon: ChartBarIcon },
    { name: 'Users', path: '/manager/users', icon: AcademicCapIcon },
        {name: 'settings', path: '/manager/settings', icon: Cog6ToothIcon}
  ];

  return (
    <div className="flex h-screen bg-gray-100"> {/* Root container - no overflow hidden */}
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Fixed height with internal scrolling */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header - fixed height */}
          <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 bg-gray-800">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-white">EduVote</span>
            </div>
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Navigation - scrollable area */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-4 h-6 w-6 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content area - flex column with proper scrolling */}
      <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 prevents flex overflow */}
        {/* Header - Fixed height */}
        <header className="bg-white shadow flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}
              {/* User profile dropdown */}
                          <div className="relative">
                            <button
                              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
                              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            >
                              <img
                                className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                                src={user?.image || 'https://www.w3schools.com/w3images/avatar2.png'}
                                alt={user?.name}
                              />
                              <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.isAdmin ? 'admin' : 'student'}</p>
                              </div>
                           <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                            </button>
              
                            {/* Profile dropdown menu */}
                            { isProfileMenuOpen &&(
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setIsProfileMenuOpen(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                  <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                  </div>
              
                            
                               
                                       <div>
                                  <a
                                    href="/"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Home
                                  </a>
                        
                                  <button
                                    onClick={()=>{
                                      logOut() ;
                                      navigate('/')
                                    }}
                                      className="block px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-50"

                                  >
                                    Sign out
                                  </button> 
                                  </div>
                                
                                </div> 
                              </>
                            )}
                          </div>
            </div>
          </div>
        </header>

         
   

        {/* Main content - scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default ManagerHome;