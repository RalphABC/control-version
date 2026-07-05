"use client";

import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Hero } from '@/components/sections/Hero';
import { ModelShowcase } from '@/components/sections/ModelShowcase';
import { Products3D } from '@/components/sections/Products3D';
import { Features } from '@/components/sections/Features';
import { CTA } from '@/components/sections/CTA';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <ScrollProgress />
      <main style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
        <Hero />
        <ModelShowcase />
        <Products3D />
        <Features />
        <CTA />
      </main>
    </>
  );
}
