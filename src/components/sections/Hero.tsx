"use client";

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { GradientText } from '@/components/ui/GradientText';
import { AccentButton } from '@/components/ui/AccentButton';
import { Model3D } from '@/components/ui/Model3D';

interface HeroContent {
  category: string;
  titleLine1: string;
  titleLine2: string;
  tagline: string;
  badge: string;
  cta: string;
  href: string;
}

const CONTENT: Record<'motocultores' | 'bombas', HeroContent> = {
  motocultores: {
    category: 'Campomaq · Maquinaria Agrícola',
    titleLine1: 'Potencia sin',
    titleLine2: 'concesiones.',
    tagline: 'Motocultores de élite para el campo ecuatoriano.',
    badge: 'AgroForce 700',
    cta: 'Ver Motocultores',
    href: 'https://www.campomaq.com.ec/productos/?category=motocultores',
  },
  bombas: {
    category: 'Campomaq · Sistemas de Fumigación',
    titleLine1: 'Cobertura que',
    titleLine2: 'multiplica.',
    tagline: 'Alta tecnología de fumigación. Menos producto, más cosecha.',
    badge: 'SprayJet 20L',
    cta: 'Ver Bombas',
    href: 'https://www.campomaq.com.ec/productos/?category=fumigadoras%20manuales',
  },
};

// Stable style object — toggleBase never changes, so no need to re-create it
const TOGGLE_BASE: CSSProperties = {
  padding: '0.55rem 1.4rem',
  borderRadius: '9999px',
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  transition: 'all 0.45s cubic-bezier(0.34,1.2,0.64,1)',
  outline: 'none',
  border: 'none',
  fontFamily: 'inherit',
};

export const Hero = () => {
  const { setProductMode, isMotocultores, accentColor, accentColorRgb, accentColorSecondary, buttonGradient, titleGradient } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Refs for direct DOM manipulation — bypasses React render cycle entirely
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const heroRectRef = useRef<DOMRect | null>(null);

  // Passed to Model3D — read inside useFrame without triggering re-renders
  const modelMouseRef = useRef({ x: 0, y: 0 });

  // Keep accent RGB accessible inside event handlers without closing over a stale value
  const accentRgbRef = useRef(accentColorRgb);
  useEffect(() => { accentRgbRef.current = accentColorRgb; }, [accentColorRgb]);

  // Fade-in (fires once)
  useEffect(() => {
    const t1 = setTimeout(() => setIsVisible(true), 140);
    return () => clearTimeout(t1);
  }, []);

  // Scroll parallax — direct DOM, no React state
  useEffect(() => {
    const h = window.innerHeight || 800;
    const handler = () => {
      const p = Math.min(window.scrollY / h, 1);
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${-p * 55}px)`;
        contentRef.current.style.opacity = String(Math.max(1 - p * 1.25, 0));
      }
      if (scrollIndRef.current) {
        scrollIndRef.current.style.opacity = String(Math.max(1 - p * 3, 0));
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Measure rect on mount and window resize to avoid layout reflows on mousemove
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const measure = () => {
      heroRectRef.current = el.getBoundingClientRect();
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Mouse tracking — direct DOM spotlight + modelMouseRef, no setState
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let frame = 0;
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = heroRectRef.current;
        if (!r) return;
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;

        if (spotlightRef.current) {
          spotlightRef.current.style.background =
            `radial-gradient(ellipse 55% 50% at ${x}% ${y}%, rgba(${accentRgbRef.current},0.05) 0%, transparent 70%)`;
        }

        modelMouseRef.current.x = (x / 100 - 0.5) * 2;
        modelMouseRef.current.y = (y / 100 - 0.5) * 2;
      });
    };
    el.addEventListener('mousemove', handler);
    return () => { el.removeEventListener('mousemove', handler); cancelAnimationFrame(frame); };
  }, []);

  const c = isMotocultores ? CONTENT.motocultores : CONTENT.bombas;

  return (
    <section
      ref={heroRef}
      id="inicio"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '6rem 1.5rem 0',
        background: '#000',
      }}
    >


      {/* Ambient gradient — CSS-transitioned on product mode change */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 50% 45% at 12% 20%, rgba(${accentColorRgb},0.1) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 88% 80%, rgba(${accentColorRgb},0.06) 0%, transparent 60%)
        `,
        transition: 'background 1.1s ease',
      }} />

      {/* Mouse spotlight — updated directly via ref, never re-renders */}
      <div ref={spotlightRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Noise grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: '128px',
      }} />

      {/* Content grid — scroll-parallaxed via ref */}
      <div
        ref={contentRef}
        className="hero-grid"
        style={{
          position: 'relative', zIndex: 10,
          maxWidth: '80rem', width: '100%', margin: '0 auto',
          willChange: 'transform, opacity',
        }}
      >
        {/* ── Left: text ── */}
        <div className="hero-text">
          {/* Product toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            gap: '0.3rem',
            padding: '0.28rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2.8rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            <button
              onClick={() => setProductMode('motocultores')}
              style={{
                ...TOGGLE_BASE,
                background: isMotocultores ? 'linear-gradient(135deg, #FACC15, #F59E0B)' : 'transparent',
                color: isMotocultores ? '#000' : 'rgba(255,255,255,0.3)',
                boxShadow: isMotocultores ? '0 0 24px rgba(250,204,21,0.35)' : 'none',
              }}
            >
              Motocultores
            </button>
            <button
              onClick={() => setProductMode('bombas')}
              style={{
                ...TOGGLE_BASE,
                background: !isMotocultores ? 'linear-gradient(135deg, #F97316, #FBBF24)' : 'transparent',
                color: !isMotocultores ? '#000' : 'rgba(255,255,255,0.3)',
                boxShadow: !isMotocultores ? '0 0 24px rgba(249,115,22,0.35)' : 'none',
              }}
            >
              Bombas
            </button>
          </div>

          {/* Category eyebrow */}
          <p style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: '1.2rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.6s ease 0.08s, transform 0.6s ease 0.08s, color 0.7s ease',
          }}>
            {c.category}
          </p>

          {/* Main title */}
          <h1 style={{
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            marginBottom: '1.8rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 0.7s ease 0.14s, transform 0.7s ease 0.14s',
          }}>
            <span style={{
              display: 'block',
              fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
              color: '#fff',
            }}>
              {c.titleLine1}
            </span>
            <GradientText
              as="span"
              gradient={titleGradient}
              animate
              style={{
                display: 'block',
                fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
              }}
            >
              {c.titleLine2}
            </GradientText>
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
            color: 'rgba(255,255,255,0.42)',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
            marginBottom: '2.8rem',
            maxWidth: '28rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.7s ease 0.22s, transform 0.7s ease 0.22s',
          }}>
            {c.tagline}
          </p>

          {/* CTA */}
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
          }}>
            <AccentButton href={c.href} gradient={buttonGradient} shadowRgb={accentColorRgb}>
              {c.cta}
              <ArrowRight size={15} />
            </AccentButton>
          </div>
        </div>

        {/* ── Right: 3D model — floating, no box ── */}
        <div className="hero-visual-wrap">
          <div style={{
            position: 'relative', width: '100%',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.94)',
            transition: 'opacity 1s ease 0.18s, transform 1s cubic-bezier(0.34,1.1,0.64,1) 0.18s',
          }}>
            {/* Atmospheric glow */}
            <div style={{
              position: 'absolute', inset: '-20%',
              background: `radial-gradient(ellipse 65% 60% at 50% 52%, rgba(${accentColorRgb},0.18) 0%, transparent 65%)`,
              filter: 'blur(55px)',
              transition: 'background 1.1s ease',
              pointerEvents: 'none',
            }} />

            {/* Decorative ring */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '115%', aspectRatio: '1',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: `1px solid rgba(${accentColorRgb},0.12)`,
              animation: 'cm-ring-cw 28s linear infinite',
              pointerEvents: 'none',
            }} />

            {/* Model — floats in open space */}
            <div className="hero-visual" style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              overflow: 'visible',
            }}>
              <Model3D
                mouseRef={modelMouseRef}
                modelScale={1.25}
                accentColor={accentColor}
                accentColorSecondary={accentColorSecondary}
                autoRotate={false}
              />
            </div>
          </div>

          {/* Live indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            marginTop: '1.5rem',
            fontSize: '0.72rem', fontWeight: 600,
            color: 'rgba(255,255,255,0.35)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s',
          }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7, flexShrink: 0 }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: accentColor,
                animation: 'cm-ping 2s cubic-bezier(0,0,0.2,1) infinite',
              }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor }} />
            </span>
            <span style={{ color: '#fff', fontWeight: 800 }}>{c.badge}</span>
            <span>· Vista 3D</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator — opacity controlled via ref on scroll */}
      <div ref={scrollIndRef} style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease 0.8s',
      }}>
        <span style={{
          fontSize: '0.55rem', letterSpacing: '0.32em',
          color: 'rgba(255,255,255,0.18)',
          textTransform: 'uppercase', fontWeight: 600,
        }}>
          Scroll
        </span>
        <div style={{ width: 1, height: 44, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)`,
            animation: 'cm-scroll-line 1.8s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Cinematic bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '28%', pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 60%, #000 100%)',
      }} />
    </section>
  );
};
