import React from 'react';
import { useLocation } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiSun, FiMoon, FiSearch, FiBell } = FiIcons;

const Header = ({ onMenuClick, darkMode, onToggleDarkMode }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/library':
        return 'Library';
      case '/add-article':
        return 'Add Article';
      case '/settings':
        return 'Settings';
      default:
        if (location.pathname.startsWith('/reader/')) {
          return 'Reading';
        }
        return 'Greta';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        >
          <SafeIcon icon={FiMenu} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <SafeIcon 
            icon={FiSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search articles..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
          <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <SafeIcon 
            icon={darkMode ? FiSun : FiMoon} 
            className="w-5 h-5 text-gray-600 dark:text-gray-400" 
          />
        </button>
      </div>
    </header>
  );
};

export default Header;