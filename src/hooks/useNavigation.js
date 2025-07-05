// Custom hook for robust navigation
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToLibrary = useCallback(() => {
    console.log('Navigation: Going to library');
    try {
      navigate('/library');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to hash navigation
      window.location.hash = '#/library';
    }
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    try {
      navigate('/');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.hash = '#/';
    }
  }, [navigate]);

  const goToSettings = useCallback(() => {
    try {
      navigate('/settings');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.hash = '#/settings';
    }
  }, [navigate]);

  const goToAddArticle = useCallback(() => {
    try {
      navigate('/add-article');
    } catch (error) {
      console.error('Navigation error:', error);
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