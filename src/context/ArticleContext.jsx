import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const ArticleContext = createContext();

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedArticles = localStorage.getItem('greta-articles');
    const savedTags = localStorage.getItem('greta-tags');
    const savedFolders = localStorage.getItem('greta-folders');

    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Default folders
      const defaultFolders = [
        { id: 'default', name: 'All Articles', color: '#3b82f6' },
        { id: 'favorites', name: 'Favorites', color: '#ef4444' },
        { id: 'read-later', name: 'Read Later', color: '#f59e0b' },
      ];
      setFolders(defaultFolders);
      localStorage.setItem('greta-folders', JSON.stringify(defaultFolders));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('greta-articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('greta-tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('greta-folders', JSON.stringify(folders));
  }, [folders]);

  const addArticle = async (articleData) => {
    setLoading(true);
    try {
      const newArticle = {
        id: Date.now().toString(),
        ...articleData,
        dateAdded: new Date().toISOString(),
        readTime: Math.ceil(articleData.content.split(' ').length / 200), // Estimate reading time
        isRead: false,
        isFavorite: false,
        highlights: [],
        notes: [],
      };

      setArticles(prev => [newArticle, ...prev]);

      // Add new tags if they don't exist
      if (articleData.tags) {
        const newTags = articleData.tags.filter(tag => !tags.includes(tag));
        if (newTags.length > 0) {
          setTags(prev => [...prev, ...newTags]);
        }
      }

      return newArticle;
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = (id, updates) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === id ? { ...article, ...updates } : article
      )
    );
  };

  const deleteArticle = (id) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  };

  const toggleFavorite = (id) => {
    updateArticle(id, { isFavorite: !articles.find(a => a.id === id)?.isFavorite });
  };

  const markAsRead = (id) => {
    updateArticle(id, { isRead: true });
  };

  const addHighlight = (articleId, highlight) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      const newHighlight = {
        id: Date.now().toString(),
        text: highlight.text,
        position: highlight.position,
        color: highlight.color || '#fef3c7',
        createdAt: new Date().toISOString(),
      };
      updateArticle(articleId, {
        highlights: [...(article.highlights || []), newHighlight]
      });
    }
  };

  const addNote = (articleId, note) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      const newNote = {
        id: Date.now().toString(),
        text: note.text,
        position: note.position,
        createdAt: new Date().toISOString(),
      };
      updateArticle(articleId, {
        notes: [...(article.notes || []), newNote]
      });
    }
  };

  const searchArticles = (query) => {
    if (!query) return articles;
    
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getArticlesByFolder = (folderId) => {
    if (folderId === 'default') return articles;
    if (folderId === 'favorites') return articles.filter(a => a.isFavorite);
    if (folderId === 'read-later') return articles.filter(a => !a.isRead);
    return articles.filter(a => a.folderId === folderId);
  };

  const getArticlesByTag = (tag) => {
    return articles.filter(a => a.tags?.includes(tag));
  };

  const getStats = () => {
    const totalArticles = articles.length;
    const readArticles = articles.filter(a => a.isRead).length;
    const favoriteArticles = articles.filter(a => a.isFavorite).length;
    const totalReadTime = articles.reduce((sum, a) => sum + (a.readTime || 0), 0);
    
    return {
      totalArticles,
      readArticles,
      favoriteArticles,
      totalReadTime,
      readingProgress: totalArticles > 0 ? (readArticles / totalArticles) * 100 : 0,
    };
  };

  const value = {
    articles,
    tags,
    folders,
    loading,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleFavorite,
    markAsRead,
    addHighlight,
    addNote,
    searchArticles,
    getArticlesByFolder,
    getArticlesByTag,
    getStats,
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};