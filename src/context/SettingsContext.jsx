import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Reading preferences
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 1.7,
    maxWidth: 800,
    
    // Theme
    darkMode: false,
    
    // Text-to-speech
    speechRate: 1.0,
    speechVoice: null,
    
    // Auto-save
    autoSave: true,
    
    // Sync
    syncEnabled: false,
    
    // Privacy
    trackingEnabled: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('greta-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('greta-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 16,
      fontFamily: 'Inter',
      lineHeight: 1.7,
      maxWidth: 800,
      darkMode: false,
      speechRate: 1.0,
      speechVoice: null,
      autoSave: true,
      syncEnabled: false,
      trackingEnabled: false,
    };
    setSettings(defaultSettings);
  };

  const value = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};