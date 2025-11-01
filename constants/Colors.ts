/**
 * Modern color system for the app
 * Based on a purple/blue gradient theme with careful attention to contrast and accessibility
 */

const tintColorLight = '#667eea';
const tintColorDark = '#667eea';

export const Colors = {
  light: {
    text: '#1a1a2e',
    background: '#f8f9ff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Primary colors
    primary: '#667eea',
    primaryLight: '#764ba2',
    primaryDark: '#4e56d8',
    // Secondary colors
    secondary: '#57c3ff',
    secondaryLight: '#7ed4ff',
    secondaryDark: '#3bb0ff',
    // Accent colors
    accent: '#ff4757',
    accentLight: '#ff6b7a',
    accentDark: '#e63946',
    // Success colors
    success: '#4ed964',
    successLight: '#6ee881',
    successDark: '#2fc651',
    // Warning colors
    warning: '#f39c12',
    warningLight: '#f5b041',
    warningDark: '#e67e22',
    // Neutral colors
    neutral: '#e0e0e0',
    neutralLight: '#f0f0f0',
    neutralDark: '#bdbdbd',
    // Text colors
    textPrimary: '#1a1a2e',
    textSecondary: '#666',
    textTertiary: '#999',
    // Background colors
    backgroundPrimary: '#f8f9ff',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#f0f0ff',
    // Border colors
    border: '#e9ecef',
    borderLight: '#f0f0f0',
    borderDark: '#dee2e6',
    // Shadow colors
    shadow: 'rgba(102, 126, 234, 0.15)',
    shadowLight: 'rgba(102, 126, 234, 0.1)',
    shadowDark: 'rgba(102, 126, 234, 0.25)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0f0f1e',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Primary colors
    primary: '#667eea',
    primaryLight: '#764ba2',
    primaryDark: '#4e56d8',
    // Secondary colors
    secondary: '#57c3ff',
    secondaryLight: '#7ed4ff',
    secondaryDark: '#3bb0ff',
    // Accent colors
    accent: '#ff4757',
    accentLight: '#ff6b7a',
    accentDark: '#e63946',
    // Success colors
    success: '#4ed964',
    successLight: '#6ee881',
    successDark: '#2fc651',
    // Warning colors
    warning: '#f39c12',
    warningLight: '#f5b041',
    warningDark: '#e67e22',
    // Neutral colors
    neutral: '#4a4a4a',
    neutralLight: '#6a6a6a',
    neutralDark: '#2a2a2a',
    // Text colors
    textPrimary: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textTertiary: '#687076',
    // Background colors
    backgroundPrimary: '#0f0f1e',
    backgroundSecondary: '#1a1a2e',
    backgroundTertiary: '#252542',
    // Border colors
    border: '#2a2a3a',
    borderLight: '#3a3a4a',
    borderDark: '#1a1a2a',
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.5)',
    shadowLight: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.7)',
  },
};
