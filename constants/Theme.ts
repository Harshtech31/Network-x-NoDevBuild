export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryVariant: string;
  
  // Accent colors
  accent: string;
  accentVariant: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Card and component colors
  card: string;
  cardHover: string;
  
  // Navigation colors
  tabActive: string;
  tabInactive: string;
  
  // Icon colors
  icon: string;
  iconSecondary: string;
}

export const lightTheme: ThemeColors = {
  // Background colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#F3F4F6',
  
  // Text colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Primary colors
  primary: '#991B1B',
  primaryVariant: '#991b1b',
  
  // Accent colors
  accent: '#ea580c',
  accentVariant: '#dc2626',
  
  // Border and divider colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Card and component colors
  card: '#FFFFFF',
  cardHover: '#F9FAFB',
  
  // Navigation colors
  tabActive: '#991B1B',
  tabInactive: '#6B7280',
  
  // Icon colors
  icon: '#374151',
  iconSecondary: '#6B7280',
};

export const darkTheme: ThemeColors = {
  // Background colors - LinkedIn/Telegram inspired deep blues and blacks
  background: '#0A0E27',
  surface: '#1A1F36',
  surfaceVariant: '#252B42',
  
  // Text colors - High contrast for readability
  text: '#FFFFFF',
  textSecondary: '#B8BCC8',
  textTertiary: '#8B8FA3',
  
  // Primary colors - Elegant burgundy with better contrast
  primary: '#E63946',
  primaryVariant: '#D62828',
  
  // Accent colors - Professional blue accent
  accent: '#457B9D',
  accentVariant: '#1D3557',
  
  // Border and divider colors - Subtle but visible
  border: '#3A4058',
  divider: '#2A2F45',
  
  // Status colors - Adjusted for dark theme
  success: '#06D6A0',
  warning: '#FFD60A',
  error: '#E63946',
  
  // Card and component colors - Layered depth
  card: '#1A1F36',
  cardHover: '#252B42',
  
  // Navigation colors
  tabActive: '#E63946',
  tabInactive: '#B8BCC8',
  
  // Icon colors - Proper contrast
  icon: '#FFFFFF',
  iconSecondary: '#B8BCC8',
};

export type Theme = 'light' | 'dark';
