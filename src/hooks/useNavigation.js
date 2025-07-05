// Custom hook for robust navigation
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToLibrary = useCallback(() => {
    console.log('Navigation: Going to library');
    
    // Method 1: Try React Router first
    try {
      navigate('/library', { replace: true });
    } catch (error) {
      console.warn('React Router navigation failed:', error);
    }
    
    // Method 2: Direct hash manipulation (always works with HashRouter)
    setTimeout(() => {
      if (window.location.hash !== '#/library') {
        console.log('Navigation: Using hash fallback');
        window.location.hash = '#/library';
      }
    }, 50);
    
    // Method 3: Force reload as last resort
    setTimeout(() => {
      if (window.location.hash !== '#/library') {
        console.log('Navigation: Using force reload');
        window.location.replace('#/library');
      }
    }, 200);
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    try {
      navigate('/', { replace: true });
    } catch (error) {
      window.location.hash = '#/';
    }
  }, [navigate]);

  const goToSettings = useCallback(() => {
    try {
      navigate('/settings', { replace: true });
    } catch (error) {
      window.location.hash = '#/settings';
    }
  }, [navigate]);

  const goToAddArticle = useCallback(() => {
    try {
      navigate('/add-article', { replace: true });
    } catch (error) {
      window.location.hash = '#/add-article';
    }
  }, [navigate]);

  return {
    goToLibrary,
    goToDashboard,
    goToSettings,
    goToAddArticle
  };
};