export const Colors = {
  // Brand colors
  primary: '#164E5E', // Deep Teal / Slate Blue used across buttons, active icons
  primaryHover: '#13404E',
  primaryLight: '#E6F3F5', // Soft teal background for active pills / badges
  primaryMuted: '#A0CAD4',
  
  // Neutral colors
  background: '#FFFFFF',
  backgroundMuted: '#F8FAFC',
  cardBackground: '#FFFFFF',
  cardBorder: '#F1F5F9',
  
  // Typography
  textPrimary: '#1E293B', // Dark charcoal/slate
  textSecondary: '#64748B', // Medium muted slate
  textTertiary: '#94A3B8', // Light slate
  textInverted: '#FFFFFF',
  
  // Status & Accents
  star: '#F59E0B', // Amber star for ratings
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  divider: '#F1F5F9',
  
  // Specialties colors (matching screenshot 2)
  specialties: {
    general: {
      bg: '#EBF5FB',
      iconColor: '#0284C7',
    },
    cardiology: {
      bg: '#FDE8E8',
      iconColor: '#EF4444',
    },
    mentalHealth: {
      bg: '#EEF2FF',
      iconColor: '#6366F1',
    },
    pediatrics: {
      bg: '#FFF1E6',
      iconColor: '#F59E0B',
    },
    neurology: {
      bg: '#F3E8FF',
      iconColor: '#9333EA',
    },
    dentistry: {
      bg: '#FCE7F3',
      iconColor: '#EC4899',
    },
  },
} as const;

export default Colors;