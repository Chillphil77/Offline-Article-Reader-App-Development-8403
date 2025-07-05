import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useArticles } from '../context/ArticleContext';

const { 
  FiHome, FiBookOpen, FiPlus, FiSettings, FiHeart, 
  FiClock, FiTag, FiFolder, FiX 
} = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { getStats, folders, tags } = useArticles();
  const stats = getStats();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/library', icon: FiBookOpen, label: 'Library' },
    { path: '/add-article', icon: FiPlus, label: 'Add Article' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg lg:relative lg:translate-x-0 lg:shadow-none"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Greta</h1>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`
                }
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}

            {/* Quick Stats */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Articles</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.totalArticles}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Read</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.readArticles}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Favorites</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.favoriteArticles}
                  </span>
                </div>
              </div>
            </div>

            {/* Folders */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Folders
              </h3>
              <div className="space-y-1">
                {folders.slice(0, 5).map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center space-x-2 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: folder.color }}
                    />
                    <span>{folder.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Greta v1.0.0
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;