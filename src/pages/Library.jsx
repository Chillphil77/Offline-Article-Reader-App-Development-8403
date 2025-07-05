import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useArticles } from '../context/ArticleContext';
import { format } from 'date-fns';

const { 
  FiSearch, FiFilter, FiGrid, FiList, FiHeart, 
  FiClock, FiCalendar, FiTag, FiMoreHorizontal,
  FiBookOpen, FiPlus, FiExternalLink 
} = FiIcons;

const Library = () => {
  const { articles, toggleFavorite, deleteArticle } = useArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      switch (filterBy) {
        case 'favorites':
          return matchesSearch && article.isFavorite;
        case 'unread':
          return matchesSearch && !article.isRead;
        case 'read':
          return matchesSearch && article.isRead;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'reading-time':
          return (a.readTime || 0) - (b.readTime || 0);
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

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

  const ArticleCard = ({ article }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link
              to={`/reader/${article.id}`}
              className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {article.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <span>{article.domain}</span>
              <span className="mx-2">•</span>
              <span>{article.author}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => toggleFavorite(article.id)}
              className={`p-2 rounded-lg transition-colors ${
                article.isFavorite
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <SafeIcon icon={FiHeart} className="w-4 h-4" />
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
            </a>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
          {article.excerpt || article.content.substring(0, 150) + '...'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
              {article.readTime}min read
            </div>
            <div className="flex items-center">
              <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
              {format(new Date(article.dateAdded), 'MMM d, yyyy')}
            </div>
            {article.isRead && (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <SafeIcon icon={FiBookOpen} className="w-3 h-3 mr-1" />
                Read
              </div>
            )}
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {article.tags.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{article.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ArticleListItem = ({ article }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <Link
            to={`/reader/${article.id}`}
            className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{article.domain}</span>
            <span>•</span>
            <span>{article.author}</span>
            <span>•</span>
            <div className="flex items-center">
              <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
              {article.readTime}min read
            </div>
            <span>•</span>
            <div className="flex items-center">
              <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
              {format(new Date(article.dateAdded), 'MMM d, yyyy')}
            </div>
            {article.isRead && (
              <>
                <span>•</span>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <SafeIcon icon={FiBookOpen} className="w-3 h-3 mr-1" />
                  Read
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <button
            onClick={() => toggleFavorite(article.id)}
            className={`p-2 rounded-lg transition-colors ${
              article.isFavorite
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <SafeIcon icon={FiHeart} className="w-4 h-4" />
          </button>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredArticles.length} articles found
            </p>
          </div>
          <Link
            to="/add-article"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Article
          </Link>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Search */}
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search articles, authors, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Articles</option>
                <option value="favorites">Favorites</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
                <option value="reading-time">Reading Time</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <SafeIcon icon={FiGrid} className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <SafeIcon icon={FiList} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Articles */}
        <motion.div variants={itemVariants}>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiBookOpen} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? "Try adjusting your search or filters"
                  : "Start building your library by adding your first article"
                }
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
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredArticles.map((article) => (
                viewMode === 'grid' 
                  ? <ArticleCard key={article.id} article={article} />
                  : <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Library;