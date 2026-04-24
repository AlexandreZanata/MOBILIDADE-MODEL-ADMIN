/**
 * ThemeProvider - Gerenciador de tema Light/Dark
 * Aplica tokens VAMU e permite toggle entre modos
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { vamuLightTheme, vamuDarkTheme, vamuCSSVariables } from './vamu';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Recupera tema salvo no localStorage ou usa 'light' como padrão
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('vamu-theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Aplica CSS variables no documento
  useEffect(() => {
    const root = document.documentElement;
    const variables = mode === 'dark' ? vamuCSSVariables.dark : vamuCSSVariables.light;
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Adiciona classe para facilitar estilização CSS
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('vamu-theme', newMode);
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('vamu-theme', newMode);
  };

  // Seleciona algoritmo do Ant Design baseado no modo
  const antdTheme = mode === 'dark' 
    ? { ...vamuDarkTheme, algorithm: theme.darkAlgorithm }
    : { ...vamuLightTheme, algorithm: undefined };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

