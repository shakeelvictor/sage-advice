import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const themeLabel: Record<Theme, string> = { light: 'Light', dark: 'Dark', system: 'Match device' };

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
