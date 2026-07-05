"use client";

import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

export type ProductMode = 'motocultores' | 'bombas';

interface Palette {
  accent: string;
  accentRgb: string;
  accentSecondary: string;
  accentSoft: string;
}

const PALETTES: Record<ProductMode, Palette> = {
  motocultores: { accent: '#FACC15', accentRgb: '250,204,21', accentSecondary: '#F59E0B', accentSoft: '#FDE68A' },
  bombas:       { accent: '#F97316', accentRgb: '249,115,22', accentSecondary: '#FBBF24', accentSoft: '#FDE68A' },
};

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
  const palette = PALETTES[productMode];

  // Stable context value — only recreated when productMode changes, NOT on every scroll tick.
  const value = useMemo<ThemeContextType>(() => ({
    productMode,
    setProductMode,
    isMotocultores,
    accentColor: palette.accent,
    accentColorRgb: palette.accentRgb,
    accentColorSecondary: palette.accentSecondary,
    buttonGradient: `linear-gradient(135deg, ${palette.accent}, ${palette.accentSecondary})`,
    headlineGradient: `linear-gradient(135deg, ${palette.accent}, ${palette.accentSecondary}, ${palette.accentSoft})`,
    titleGradient: `linear-gradient(100deg, ${palette.accent}, ${palette.accentSecondary}, ${palette.accentSoft}, ${palette.accentSecondary})`,
  }), [productMode]); // eslint-disable-line react-hooks/exhaustive-deps

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
