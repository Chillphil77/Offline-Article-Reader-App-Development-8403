import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useArticles } from '../context/ArticleContext';
import { format } from 'date-fns';

const { 
  FiBookOpen, FiHeart, FiClock, FiTrendingUp, 
  FiPlus, FiEye, FiCalendar, FiActivity 
} = FiIcons;

const Dashboard = () => {
  const { articles, getStats } = useArticles();
  const stats = getStats();
  const recentArticles = articles.slice(0, 5);

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: FiBookOpen,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Read Articles',
      value: stats.readArticles,
      icon: FiEye,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Favorites',
      value: stats.favoriteArticles,
      icon: FiHeart,
      color: 'bg-red-500',
      change: '+5%',
    },
    {
      title: 'Reading Time',
      value: `${stats.totalReadTime}min`,
      icon: FiClock,
      color: 'bg-purple-500',
      change: '+15%',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back! 📚
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your reading progress.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  vs last week
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/add-article"
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
            >
              <SafeIcon icon={FiPlus} className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg">Add New Article</h3>
              <p className="text-blue-100 text-sm mt-1">
                Save articles from any website
              </p>
            </Link>
            
            <Link
              to="/library"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <SafeIcon icon={FiBookOpen} className="w-8 h-8 mb-3 text-green-500" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Browse Library
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Explore your saved articles
              </p>
            </Link>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <SafeIcon icon={FiActivity} className="w-8 h-8 mb-3 text-purple-500" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Reading Progress
              </h3>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {Math.round(stats.readingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.readingProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Articles */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Articles
            </h2>
            <Link
              to="/library"
              className="text-blue-500 hover:text-blue-600 font-medium text-sm"
            >
              View All
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {recentArticles.length === 0 ? (
              <div className="p-8 text-center">
                <SafeIcon icon={FiBookOpen} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No articles yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start building your reading library by adding your first article.
                </p>
                <Link
                  to="/add-article"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Article
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/reader/${article.id}`}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {article.domain} • {article.readTime}min read
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {article.isFavorite && (
                          <SafeIcon icon={FiHeart} className="w-4 h-4 text-red-500" />
                        )}
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                          {format(new Date(article.dateAdded), 'MMM d')}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;