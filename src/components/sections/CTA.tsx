"use client";

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { GradientText } from '@/components/ui/GradientText';
import { AccentButton } from '@/components/ui/AccentButton';

const SecondaryButton = ({ href, children }: { href: string; children: ReactNode }) => {
  const [hovered, setHovered] = useState(false);

  return (
    // Transform lives on the inner span, not this `<a>` — see AccentButton
    // for why (a moving hit-box thrashes the custom cursor's hover state).
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', textDecoration: 'none', borderRadius: '9999px' }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        padding: '1.1rem 2.4rem',
        borderRadius: '9999px',
        fontSize: '0.88rem', fontWeight: 700,
        letterSpacing: '0.04em',
        color: hovered ? '#fff' : 'rgba(255,255,255,0.7)',
        background: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(8px)',
        fontFamily: 'inherit',
      }}>
        {children}
      </span>
    </a>
  );
};

export const CTA = () => {
  const { isMotocultores, accentColor, accentColorRgb, buttonGradient, headlineGradient } = useTheme();
  const { ref: sectionRef, entered } = useScrollReveal<HTMLElement>(0.2);

  // Imperative mouse spotlight — no React state, so CTA never re-renders on mouse move
  const meshRef = useRef<HTMLDivElement>(null);
  const accentRgbRef = useRef(accentColorRgb);
  useEffect(() => { accentRgbRef.current = accentColorRgb; }, [accentColorRgb]);

  useEffect(() => {
    const el = meshRef.current;
    if (!el) return;
    let frame = 0;
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.background = `radial-gradient(ellipse 80% 60% at ${x}% ${y}%, rgba(${accentRgbRef.current},0.08) 0%, transparent 70%)`;
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => { window.removeEventListener('mousemove', handler); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      style={{
        position: 'relative',
        padding: '10rem 1.5rem',
        background: '#000',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* ── Animated background mesh ── */}
      {/* Background mesh — updated imperatively on mouse move, never causes re-renders */}
      <div ref={meshRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        transition: 'background 0.8s ease-out',
      }} />

      {/* Rotating ring decorations */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 700, height: 700,
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: `1px solid rgba(${accentColorRgb},0.06)`,
        animation: 'cm-ring-cw 20s linear infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 500, height: 500,
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: `1px solid rgba(${accentColorRgb},0.08)`,
        animation: 'cm-ring-ccw 14s linear infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 300, height: 300,
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: `1px solid rgba(${accentColorRgb},0.1)`,
        animation: 'cm-ring-cw 8s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Horizontal lines */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(to right, transparent, rgba(${accentColorRgb},0.25), transparent)`,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(to right, transparent, rgba(${accentColorRgb},0.15), transparent)`,
      }} />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '52rem', margin: '0 auto' }}>
        {/* Eyebrow */}
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.4em',
          color: accentColor, fontWeight: 700,
          textTransform: 'uppercase', marginBottom: '1.5rem',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          ¿Listo para transformar tu campo?
        </div>

        {/* Main headline */}
        <h2 style={{
          fontSize: 'clamp(2rem, 6vw, 5rem)',
          fontWeight: 900, letterSpacing: '-0.04em',
          lineHeight: 0.95,
          color: '#fff',
          marginBottom: '1.5rem',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
        }}>
          Eleva tu<br />
          <GradientText gradient={headlineGradient}>productividad</GradientText>
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
          color: 'rgba(255,255,255,0.45)',
          maxWidth: '480px', margin: '0 auto 3rem',
          lineHeight: 1.8,
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
        }}>
          {isMotocultores
            ? 'Visita nuestro catálogo completo y encuentra el motocultor perfecto para tu tipo de suelo y cultivo.'
            : 'Descubre toda la gama de bombas de fumigación y riego. Más cobertura, menos tiempo, mejores resultados.'}
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
        }}>
          <AccentButton href="https://www.campomaq.com.ec/productos/" gradient={buttonGradient} shadowRgb={accentColorRgb}>
            Catálogo Completo →
          </AccentButton>
          <SecondaryButton href="https://www.campomaq.com.ec/">
            Sitio Oficial
          </SecondaryButton>
        </div>

        {/* Trust indicators */}
        <div style={{
          display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap',
          marginTop: '3.5rem',
          opacity: entered ? 1 : 0,
          transition: 'opacity 0.7s ease 0.5s',
        }}>
          {[
            'Envío a todo el Ecuador',
            'Soporte técnico incluido',
            'Garantía oficial',
          ].map((text) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)',
              fontWeight: 600,
            }}>
              <span style={{ color: accentColor }}>✓</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
