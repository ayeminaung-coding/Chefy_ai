import React, { createContext, ReactNode, useContext } from 'react';
import useSettingsStore from '../../store/settingsStore';
import { Colors, COLORS, DARK_COLORS } from './colors';

interface ThemeContextValue {
  colors: Colors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: COLORS,
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const darkMode = useSettingsStore((s) => s.darkMode);
  return (
    <ThemeContext.Provider value={{ colors: darkMode ? DARK_COLORS : COLORS, isDark: darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextValue => useContext(ThemeContext);
