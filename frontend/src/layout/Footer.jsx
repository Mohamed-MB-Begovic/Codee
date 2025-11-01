import React, { useState } from 'react';
import { 
  HomeIcon, 
  CheckCircleIcon, 
  ChartBarIcon, 
  UserIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Footer = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useUser();

  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/home' },
    { id: 'vote', label: 'Vote', icon: CheckCircleIcon, path: '/voting' },
    { id: 'results', label: 'Results', icon: ChartBarIcon, path: '/results' },
  ];

  const handleItemClick = () => {
    setIsProfileOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logOut?.();
    navigate('/home');
    setIsProfileOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsProfileOpen(false);
  };

  return (
<div className="lg:hidden bg-white h-full">
  {/* Backdrop - only show when profile menu is open */}
  {isProfileOpen && (
    <div
      className="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-md animate-fade-in"
      onClick={() => setIsProfileOpen(false)}
    />
  )}

  {/* Profile/Login Modal - only show when menu is open */}
  {isProfileOpen && (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white rounded-t-3xl shadow-xl border-t border-gray-100 p-6">
        {/* Handle Bar */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {user ? (
          // User is logged in - Show Profile Menu
          <>
            {/* User Info */}
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user?.image || 'https://www.w3schools.com/w3images/avatar2.png'}
                alt={user?.name || 'User'}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {user?.name || 'Guest'}
                </h3>
                <p className="text-sm text-gray-500">
                  {user?.isAdmin ? user?.email || 'N/A' : user?.studentId || 'N/A'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                  {user?.role === 'superadmin' ? 'Super Admin' : 
                   user?.isAdmin ? 'Admin' : 'Student'}
                </p>
              </div>
            </div>

            {/* Menu Buttons */}
            <div className="space-y-2">
              {/* Dashboard links based on user role */}
              {(user?.isAdmin || user?.role === 'superadmin') && (
                <button
                  onClick={() => handleNavigation(user?.role === 'superadmin' ? '/manager' : '/admin')}
                  className="w-full text-left py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 font-medium text-gray-700 transition-colors duration-200"
                >
                  {user?.role === 'superadmin' ? 'Manager Dashboard' : 'Admin Dashboard'}
                </button>
              )}

         

              {/* Sign out for all users */}
              <button
                onClick={handleLogout}
                className="w-full text-left py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 font-medium text-red-600 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          // No user - Show Login Menu
          <>
            {/* Guest Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Guest User
                </h3>
                <p className="text-sm text-gray-500">
                  Please log in to access all features
                </p>
              </div>
            </div>

            {/* Login Button */}
            <div className="space-y-2">
              <button
                onClick={handleLogin}
                className="w-full text-left py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 font-medium text-blue-600 transition-colors duration-200 flex items-center justify-between"
              >
                <span>Sign In to Your Account</span>
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
              
              {/* Optional: Uncomment if you want register button */}
              {/* <button
                onClick={() => handleNavigation('/register')}
                className="w-full text-left py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 font-medium text-gray-700 transition-colors duration-200"
              >
                Create New Account
              </button> */}
            </div>
          </>
        )}
      </div>
    </div>
  )}

  {/* Footer Navigation */}
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
    <div className="flex justify-around items-center py-3">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            to={item.path}
            key={item.id}
            className="flex flex-col items-center justify-center w-16 h-16"
            onClick={handleItemClick}
          >
            <div
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 bg-blue-50 border border-blue-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}

      {/* Profile/Login Button */}
      <button
        onClick={toggleProfileMenu}
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
          isProfileOpen
            ? 'text-blue-600 bg-blue-50 border border-blue-200'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="relative">
          {user ? (
            // User is logged in - show user icon with chevron
            <>
              <UserIcon className="w-6 h-6" />
              {isProfileOpen ? (
                <ChevronUpIcon className="w-4 h-4 absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 absolute -bottom-1 -right-1 bg-gray-400 text-white rounded-full" />
              )}
            </>
          ) : (
            // No user - show login icon
            <>
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              {isProfileOpen && (
                <ChevronUpIcon className="w-4 h-4 absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full" />
              )}
            </>
          )}
        </div>
        <span className={`text-xs mt-1 ${isProfileOpen ? 'font-semibold' : ''}`}>
          {user ? 'Profile' : 'Login'}
        </span>
      </button>
    </div>
  </div>
</div>
  );
};

export default Footer;