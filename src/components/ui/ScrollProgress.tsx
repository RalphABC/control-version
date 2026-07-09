// Justificación: requiere escuchar el evento de scroll global de window y actualizar el ancho del elemento mediante una referencia DOM directa.
"use client";

import { useEffect, useRef } from 'react';

export const ScrollProgress = () => {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const progress = total > 0 ? (el.scrollTop / total) * 100 : 0;
      if (fillRef.current) {
        fillRef.current.style.width = `${progress}%`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9000] bg-line">
      <div
        ref={fillRef}
        className="h-full bg-brand transition-[width_0.1s_linear,_background_0.6s_ease]"
        style={{
          width: '0%',
          boxShadow: '0 0 8px var(--color-brand)',
        }}
      />
    </div>
  );
};
