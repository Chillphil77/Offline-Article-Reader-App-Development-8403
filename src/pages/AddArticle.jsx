import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useArticles } from '../context/ArticleContext';
import { extractArticleFromUrl, testUrlAccessibility } from '../utils/articleExtractor';

const { FiLink, FiPlus, FiLoader, FiCheck, FiX, FiGlobe, FiBookOpen, FiAlertTriangle, FiClock } = FiIcons;

const AddArticle = () => {
  const navigate = useNavigate();
  const { addArticle, loading } = useArticles();
  const [url, setUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customTags, setCustomTags] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setExtractionStatus('');
    setProgress(0);

    if (!url.trim()) {
      setError('Bitte gib eine gültige URL ein');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Bitte gib eine gültige URL ein');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Step 1: Quick accessibility test (optional)
      setExtractionStatus('Teste URL-Erreichbarkeit...');
      setProgress(20);
      
      const accessibility = await testUrlAccessibility(url);
      
      // Step 2: Extract article content
      setExtractionStatus('Extrahiere Artikel-Inhalt...');
      setProgress(40);
      
      const extractedData = await extractArticleFromUrl(url);
      
      setProgress(70);
      setExtractionStatus('Verarbeite Artikel-Daten...');
      
      // Step 3: Prepare article data
      const articleData = {
        ...extractedData,
        title: customTitle.trim() || extractedData.title,
        tags: customTags.trim() 
          ? customTags.split(',').map(tag => tag.trim()).filter(Boolean)
          : extractedData.tags || [],
      };

      setProgress(90);
      setExtractionStatus('Speichere Artikel...');
      
      // Step 4: Save article
      await addArticle(articleData);
      
      setProgress(100);
      setSuccess(true);
      setExtractionStatus('Artikel erfolgreich gespeichert!');
      
      // Reset form
      setUrl('');
      setCustomTitle('');
      setCustomTags('');
      
      // Navigate to library after a short delay
      setTimeout(() => {
        navigate('/library');
      }, 1500);
      
    } catch (err) {
      console.error('Article processing failed:', err);
      setError(err.message || 'Fehler beim Verarbeiten des Artikels. Bitte versuche es erneut.');
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Artikel hinzufügen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Speichere Artikel von beliebigen Websites zum Offline-Lesen
          </p>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Artikel-URL
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiLink} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/artikel"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Custom Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Eigener Titel (Optional)
              </label>
              <input
                id="title"
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Artikel-Titel überschreiben"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
            </div>

            {/* Custom Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Optional)
              </label>
              <input
                id="tags"
                type="text"
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
                placeholder="Tags durch Kommas getrennt"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                z.B. Technologie, Web Development, React
              </p>
            </div>

            {/* Processing Status with Progress Bar */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <div className="flex items-center mb-3">
                  <SafeIcon icon={FiLoader} className="w-5 h-5 text-blue-500 mr-3 animate-spin" />
                  <span className="text-blue-700 dark:text-blue-400 font-medium">{extractionStatus}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <span>{progress}%</span>
                  <div className="flex items-center">
                    <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                    <span>Bitte warten...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start"
              >
                <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div className="text-red-700 dark:text-red-400">
                  <p className="font-medium">Fehler beim Extrahieren</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
              >
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-green-700 dark:text-green-400">
                  Artikel erfolgreich hinzugefügt! Weiterleitung zur Bibliothek...
                </span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <SafeIcon icon={FiLoader} className="w-5 h-5 mr-2 animate-spin" />
                  Extrahiere Artikel...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
                  Artikel hinzufügen
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Quick Test URLs */}
        <motion.div variants={itemVariants}>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              🚀 Schnell-Test URLs
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Teste das System mit diesen bewährten URLs:
            </p>
            <div className="space-y-2">
              {[
                'https://en.wikipedia.org/wiki/Artificial_intelligence',
                'https://github.com/microsoft/vscode/blob/main/README.md',
                'https://www.bbc.com/news/technology',
                'https://techcrunch.com/2024/01/01/ai-trends/'
              ].map((testUrl, index) => (
                <button
                  key={index}
                  onClick={() => setUrl(testUrl)}
                  className="block w-full text-left px-3 py-2 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors text-sm"
                  disabled={isProcessing}
                >
                  {testUrl}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Limitations */}
        <motion.div variants={itemVariants}>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
              ⚠️ Bekannte Einschränkungen
            </h3>
            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
              <p>• <strong>Paywall-Artikel:</strong> Kostenpflichtige Inhalte können nicht extrahiert werden</p>
              <p>• <strong>JavaScript-Seiten:</strong> Dynamisch geladene Inhalte sind problematisch</p>
              <p>• <strong>Anti-Bot-Schutz:</strong> Manche Websites blockieren automatisierte Zugriffe</p>
              <p>• <strong>Timeout:</strong> Sehr langsame Websites werden nach 15 Sekunden abgebrochen</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddArticle;