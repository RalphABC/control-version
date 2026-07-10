// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScrollingBackground } from '@/components/ui/ScrollingBackground';
import { FloatingContact } from '@/components/ui/FloatingContact';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Campomaq | Titan PRO - Motocultores de Élite',
  description: 'Garantizamos nuestro servicio. Motocultores y sistemas de fumigación de alta calidad. Más de 20 años ofreciendo maquinaria de confianza para el agricultor ecuatoriano.',
  keywords: 'motocultores, campomaq, titan pro, bombas fumigación, maquinaria agrícola ecuador, motocultor cayambe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ScrollingBackground />
          <FloatingContact />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}