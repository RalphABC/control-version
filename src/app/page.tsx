"use client";

import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { ModelShowcase } from '@/components/sections/ModelShowcase';
import { YoutubeVideo } from '@/components/sections/YoutubeVideo';
import { Products3D } from '@/components/sections/Products3D';
import { CTA } from '@/components/sections/CTA';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Header />
      <ScrollProgress />
      <main style={{ position: 'relative', zIndex: 1, color: '#fff', minHeight: '100vh' }}>
        <Hero />
        <ModelShowcase />
        <YoutubeVideo />
        <Products3D />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
