import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';

const { 
  FiType, FiVolume2, FiSave, FiCloud, FiShield, 
  FiMoon, FiSun, FiRefreshCw, FiCheck 
} = FiIcons;

const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();

  const settingSections = [
    {
      title: 'Reading Preferences',
      icon: FiType,
      settings: [
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'range',
          min: 12,
          max: 24,
          value: settings.fontSize,
          unit: 'px',
        },
        {
          key: 'lineHeight',
          label: 'Line Height',
          type: 'range',
          min: 1.2,
          max: 2.0,
          step: 0.1,
          value: settings.lineHeight,
        },
        {
          key: 'fontFamily',
          label: 'Font Family',
          type: 'select',
          value: settings.fontFamily,
          options: [
            { value: 'Inter', label: 'Inter (Sans-serif)' },
            { value: 'Merriweather', label: 'Merriweather (Serif)' },
            { value: 'JetBrains Mono', label: 'JetBrains Mono (Monospace)' },
          ],
        },
        {
          key: 'maxWidth',
          label: 'Max Content Width',
          type: 'range',
          min: 600,
          max: 1200,
          step: 50,
          value: settings.maxWidth,
          unit: 'px',
        },
      ],
    },
    {
      title: 'Text-to-Speech',
      icon: FiVolume2,
      settings: [
        {
          key: 'speechRate',
          label: 'Speech Rate',
          type: 'range',
          min: 0.5,
          max: 2.0,
          step: 0.1,
          value: settings.speechRate,
        },
      ],
    },
    {
      title: 'Data & Storage',
      icon: FiSave,
      settings: [
        {
          key: 'autoSave',
          label: 'Auto-save reading progress',
          type: 'toggle',
          value: settings.autoSave,
        },
        {
          key: 'syncEnabled',
          label: 'Cloud sync (Coming Soon)',
          type: 'toggle',
          value: settings.syncEnabled,
          disabled: true,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: FiShield,
      settings: [
        {
          key: 'trackingEnabled',
          label: 'Anonymous usage analytics',
          type: 'toggle',
          value: settings.trackingEnabled,
        },
      ],
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

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'range':
        return (
          <div>
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step || 1}
              value={setting.value}
              onChange={(e) => updateSetting(setting.key, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={setting.disabled}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{setting.min}</span>
              <span className="font-medium">
                {setting.value}{setting.unit}
              </span>
              <span>{setting.max}</span>
            </div>
          </div>
        );

      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={setting.disabled}
          >
            {setting.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <button
            onClick={() => updateSetting(setting.key, !setting.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              setting.value
                ? 'bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
            } ${setting.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={setting.disabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                setting.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your reading experience and app preferences
          </p>
        </motion.div>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <motion.div
            key={section.title}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <SafeIcon icon={section.icon} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {setting.label}
                      </h3>
                      {setting.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {setting.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-6 w-64">
                      {renderSetting(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Actions */}
        <motion.div variants={itemVariants}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Actions
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Reset to Defaults
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Restore all settings to their default values
                    </p>
                  </div>
                  <button
                    onClick={resetSettings}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Export Settings
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Download your settings as a backup file
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(settings, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                      const exportFileDefaultName = 'greta-settings.json';
                      
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', exportFileDefaultName);
                      linkElement.click();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiCheck} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Greta v1.0.0
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your offline article reader
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with privacy in mind. All your data is stored locally on your device.
              No tracking, no ads, just pure reading experience.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;