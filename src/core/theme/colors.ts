export const COLORS = {
  text: '#1A1A1A',
  background: '#F8F9FA',
  primary: '#FF6B6B',
  secondary: '#FFD93D',
  accent: '#4D96FF',
  white: '#FFFFFF',
  textSecondary: '#6C757D',
  success: '#2ECC71',
  border: '#E9ECEF',
  error: '#FF4757',
  warning: '#FFA502',
  disabled: '#CED4DA',
  card: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
} as const;

export const DARK_COLORS = {
  text: '#F0F0F0',
  background: '#0F0F0F',
  primary: '#FF6B6B',
  secondary: '#FFD93D',
  accent: '#5AA3FF',
  white: '#1C1C1E',
  textSecondary: '#8E8E93',
  success: '#32D74B',
  border: '#2C2C2E',
  error: '#FF453A',
  warning: '#FF9F0A',
  disabled: '#3A3A3C',
  card: '#1C1C1E',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type Colors = typeof COLORS;
export type ColorKey = keyof typeof COLORS;
export type ColorValue = (typeof COLORS)[ColorKey];

export default COLORS;
