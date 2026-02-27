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

export type ColorKey = keyof typeof COLORS;
export type ColorValue = (typeof COLORS)[ColorKey];

export default COLORS;
