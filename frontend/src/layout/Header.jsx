/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { 
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { div } from 'framer-motion/client';
import { useUser } from '../context/UserContext';
import {Link, useLocation} from 'react-router-dom'
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const location = useLocation();

  const {logOut,user,refreshUser}=useUser()
 
useEffect(() => {
  refreshUser(); // ✅ always get the latest user info on load
}, []);

 

  // Navigation items
const navigation = [
    { name: "Home", href: "/" },
    { name: "Vote", href: "/voting" },
    { name: "Results", href: "/results" },
    // { name: "Candidates", href: "/candidates" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="hidden lg:block md:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
      
            
            <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                EduVote
              </span>
            </div>

  
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:ml-8 lg:space-x-8">
      {navigation.map((item) => {
        const isCurrent = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isCurrent
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
          {/* Right side items */}
        {  !user ?     <Link
      to="/login"
      className="group inline-flex items-center gap-2 px-5 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      <span>Sign In</span>
    </Link>:
         <div className="flex items-center space-x-4">
            {/* Notification bell */}
            {/* <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative">
              <BellIcon className="h-5 w-5" />
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
                  src={user?.isAdmin ? 'https://www.w3schools.com/w3images/avatar3.png':'https://www.w3schools.com/w3images/avatar2.png'}
                  alt={user?.name}
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.isAdmin ? 'admin' : 'student'}</p>
                </div>
             <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </button>

              {/* Profile dropdown menu */}
          {/* Profile dropdown menu */}
{isProfileMenuOpen && (
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
      
{/* Dashboard links based on user role */}
{(user?.isAdmin || user?.role === 'superadmin') && (
  <>
    {/* Superadmin always allowed */}
    {user?.role === 'superadmin' ? (
      <Link
        to="/manager"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        onClick={() => setIsProfileMenuOpen(false)}
      >
        Dashboard
      </Link>
    ) : (
      // Admin: only if status is active
      <>
        {user?.status === 'active' ? (
          <Link
            to="/admin"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsProfileMenuOpen(false)}
          >
            Dashboard
          </Link>
        ) : (
          <div
            className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed opacity-60"
            title="Dashboard access disabled — admin is not active"
          >
            Dashboard
          </div>
        )}
      </>
    )}
  </>
)}

      {/* Sign out for all users */}
      <button
        onClick={() => {
          setIsProfileMenuOpen(false);
          logOut();
        }}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Sign out
      </button>
    </div>
  </>
)}
            </div>
          </div>
          }
        </div>
 
      </div>
    </header>
  );
};

export default Header;