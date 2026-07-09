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
        background: 'rgba(0,0,0,0.82)',
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
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '56rem', 
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: `1px solid rgba(${accentColorRgb}, 0.15)`,
          borderRadius: '3rem',
          padding: '4.5rem 2rem',
          boxShadow: `0 30px 70px rgba(0,0,0,0.6), 0 0 45px rgba(${accentColorRgb}, 0.04), inset 0 1px 0 rgba(255,255,255,0.08)`,
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: '0.68rem', 
            letterSpacing: '0.35em',
            color: accentColor, 
            fontWeight: 800,
            textTransform: 'uppercase', 
            marginBottom: '0.5rem',
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            ¿Listo para transformar tu campo?
          </div>

          {/* Main headline */}
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
            fontWeight: 900, 
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#fff',
            maxWidth: '46rem',
            margin: '0 auto',
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(25px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}>
            Más de 20 años<br />
            <GradientText gradient={headlineGradient}>impulsando el desarrollo del campo ecuatoriano.</GradientText>
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.9rem, 1.3vw, 1.02rem)',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '38rem', 
            margin: '0.5rem auto 1.75rem',
            lineHeight: 1.7,
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}>
            Ofrecemos maquinaria agrícola de confianza, servicio técnico calificado y repuestos originales a nivel nacional. Respaldamos tu inversión en cada cosecha.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: 'flex', 
            gap: '1.25rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
          }}>
            <AccentButton href="https://www.campomaq.com.ec/productos/" gradient={buttonGradient} shadowRgb={accentColorRgb}>
              Catálogo Completo →
            </AccentButton>
            <SecondaryButton href="https://www.campomaq.com.ec/">
              Sitio Oficial
            </SecondaryButton>
          </div>
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
