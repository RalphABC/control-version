"use client";

// use client is required because we manage state of product mode and manipulate the DOM (document.documentElement) at runtime.
import React, { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';

export type ProductMode = 'motocultores' | 'bombas';

interface ThemeContextType {
  productMode: ProductMode;
  setProductMode: (mode: ProductMode) => void;
  isMotocultores: boolean;
  accentColor: string;
  accentColorRgb: string;
  accentColorSecondary: string;
  buttonGradient: string;
  headlineGradient: string;
  titleGradient: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [productMode, setProductMode] = useState<ProductMode>('motocultores');

  const isMotocultores = productMode === 'motocultores';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-mode', productMode);
    }
  }, [productMode]);

  const value = useMemo<ThemeContextType>(() => ({
    productMode,
    setProductMode,
    isMotocultores,
    accentColor: 'var(--color-brand)',
    accentColorRgb: 'var(--color-brand-rgb-current)',
    accentColorSecondary: 'var(--color-brand-secondary)',
    buttonGradient: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-secondary))',
    headlineGradient: 'linear-gradient(135deg, var(--color-brand), var(--color-brand-secondary), var(--text-strong))',
    titleGradient: 'linear-gradient(100deg, var(--color-brand), var(--color-brand-secondary), var(--text-strong), var(--color-brand-secondary))',
  }), [productMode, isMotocultores]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
