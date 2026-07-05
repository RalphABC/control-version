// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AgroTech - Maquinaria Agrícola Profesional',
  description: 'Motocultores y bombas de fumigación de alta calidad. Potencia, durabilidad y eficiencia para tu campo.',
  keywords: 'motocultores, bombas fumigación, maquinaria agrícola, equipos campo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}