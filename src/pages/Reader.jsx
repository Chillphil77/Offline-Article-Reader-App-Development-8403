import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useArticles } from '../context/ArticleContext';
import { useSettings } from '../context/SettingsContext';
import { useNavigation } from '../hooks/useNavigation';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { generatePDF } from '../utils/pdfGenerator';
import { format } from 'date-fns';

const { 
  FiArrowLeft, FiHeart, FiShare2, FiDownload, FiVolume2, FiPause, FiPlay, 
  FiType, FiSun, FiMoon, FiBookmark, FiHighlighter, FiMessageCircle, 
  FiSettings, FiPrinter, FiExternalLink, FiMinus, FiPlus, FiVolumeX 
} = FiIcons;

const Reader = () => {
  const { id } = useParams();
  const { goToLibrary } = useNavigation();
  const { articles, toggleFavorite, markAsRead, addHighlight, addNote } = useArticles();
  const { settings, updateSetting } = useSettings();
  const { speak, stop, isPlaying, voices, selectedVoice, setSelectedVoice, rate, setRate } = useTextToSpeech();
  
  const [article, setArticle] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [showTTSSettings, setShowTTSSettings] = useState(false);

  useEffect(() => {
    const foundArticle = articles.find(a => a.id === id);
    if (foundArticle) {
      setArticle(foundArticle);
      markAsRead(id);
      setIsLoading(false);
    } else {
      setTimeout(() => {
        goToLibrary();
      }, 1000);
    }
  }, [id, articles, goToLibrary, markAsRead]);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        setSelectedText(text);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setShowHighlightMenu(true);
      } else {
        setShowHighlightMenu(false);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  const handleHighlight = (color = '#fef3c7') => {
    if (selectedText && article) {
      addHighlight(article.id, {
        text: selectedText,
        color,
        position: 0,
      });
      setShowHighlightMenu(false);
      window.getSelection().removeAllRanges();
    }
  };

  const handleAddNote = () => {
    if (selectedText && article) {
      const noteText = prompt('Add a note:');
      if (noteText) {
        addNote(article.id, {
          text: noteText,
          position: 0,
        });
      }
      setShowHighlightMenu(false);
      window.getSelection().removeAllRanges();
    }
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(article?.content || '', { rate });
    }
  };

  const handleDownloadPDF = async () => {
    if (!article) return;
    
    setPdfGenerating(true);
    try {
      await generatePDF(article);
    } catch (error) {
      alert('PDF generation failed. Please try again or check your popup blocker settings.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: article?.url,
      });
    } else {
      navigator.clipboard.writeText(article?.url || '');
      alert('Article URL copied to clipboard!');
    }
  };

  const openOriginalArticle = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const increaseFontSize = () => {
    const newSize = Math.min(settings.fontSize + 2, 32);
    updateSetting('fontSize', newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(settings.fontSize - 2, 10);
    updateSetting('fontSize', newSize);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <SafeIcon icon={FiBookmark} className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <SafeIcon icon={FiBookmark} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Article not found</p>
          <button
            onClick={goToLibrary}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const readerStyles = {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    fontFamily: settings.fontFamily,
    maxWidth: `${settings.maxWidth}px`,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={goToLibrary}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 font-medium"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Back to Library</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {/* Font Size Controls */}
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={decreaseFontSize}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Decrease font size"
                >
                  <SafeIcon icon={FiMinus} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400 px-2 min-w-[3rem] text-center">
                  {settings.fontSize}px
                </span>
                <button
                  onClick={increaseFontSize}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Increase font size"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Text-to-Speech */}
              <div className="relative">
                <button
                  onClick={toggleSpeech}
                  className={`p-2 rounded-lg transition-colors ${
                    isPlaying 
                      ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={isPlaying ? 'Stop reading' : 'Start reading'}
                >
                  <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-5 h-5" />
                </button>
                
                {/* TTS Settings */}
                <button
                  onClick={() => setShowTTSSettings(!showTTSSettings)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Voice settings"
                >
                  <SafeIcon icon={FiSettings} className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => toggleFavorite(article.id)}
                className={`p-2 rounded-lg transition-colors ${
                  article.isFavorite 
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={article.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <SafeIcon icon={FiHeart} className="w-5 h-5" />
              </button>

              {/* PDF Download */}
              <button
                onClick={handleDownloadPDF}
                disabled={pdfGenerating}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Download as PDF"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {pdfGenerating ? 'Generating...' : 'PDF'}
                </span>
              </button>

              <button
                onClick={shareArticle}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Share article"
              >
                <SafeIcon icon={FiShare2} className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Reading settings"
              >
                <SafeIcon icon={FiSettings} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TTS Settings Panel */}
      {showTTSSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 z-30 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700 no-print"
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice Selection
                </label>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Speech Rate: {rate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reading Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 z-30 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 no-print"
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Font Size
                </label>
                <input
                  type="range"
                  min="10"
                  max="32"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.fontSize}px</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Line Height
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.lineHeight}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="Inter">Inter</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Width
                </label>
                <input
                  type="range"
                  min="600"
                  max="1200"
                  step="50"
                  value={settings.maxWidth}
                  onChange={(e) => updateSetting('maxWidth', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.maxWidth}px</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Highlight Menu */}
      {showHighlightMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 no-print"
          style={{
            left: menuPosition.x - 100,
            top: menuPosition.y - 50,
          }}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleHighlight('#fef3c7')}
              className="w-6 h-6 bg-yellow-200 rounded border-2 border-yellow-300 hover:border-yellow-400"
            />
            <button
              onClick={() => handleHighlight('#fecaca')}
              className="w-6 h-6 bg-red-200 rounded border-2 border-red-300 hover:border-red-400"
            />
            <button
              onClick={() => handleHighlight('#bbf7d0')}
              className="w-6 h-6 bg-green-200 rounded border-2 border-green-300 hover:border-green-400"
            />
            <button
              onClick={() => handleHighlight('#bfdbfe')}
              className="w-6 h-6 bg-blue-200 rounded border-2 border-blue-300 hover:border-blue-400"
            />
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
            <button
              onClick={handleAddNote}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <SafeIcon icon={FiMessageCircle} className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={readerStyles}
          className="mx-auto"
        >
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span className="font-medium">{article.author || 'Unknown Author'}</span>
              <span>•</span>
              <span>{format(new Date(article.dateAdded), 'MMM d, yyyy')}</span>
              <span>•</span>
              <span>{article.readTime} min read</span>
              <span>•</span>
              <span>{article.domain}</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="reading-content prose prose-lg dark:prose-invert max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-800 dark:text-gray-200">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => toggleFavorite(article.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    article.isFavorite
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <SafeIcon icon={FiHeart} className="w-4 h-4" />
                  <span>{article.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={shareArticle}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiShare2} className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span>{pdfGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>

                <button
                  onClick={goToLibrary}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                  <span>Back to Library</span>
                </button>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <button
                  onClick={openOriginalArticle}
                  className="flex items-center space-x-2 px-3 py-2 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                  <span>View Original</span>
                </button>
              </div>
            </div>
          </footer>
        </motion.article>
      </div>
    </div>
  );
};

export default Reader;