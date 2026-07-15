"use client";

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { GradientText } from '@/components/ui/GradientText';
import { AccentButton } from '@/components/ui/AccentButton';

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
    titleLine1: 'TITAN',
    titleLine2: 'PRO',
    tagline: 'El motocultor diésel estrella de Campomaq. Con potencia de 16 HP, alta resistencia para el trabajo pesado y rendimiento superior diseñado para la labranza exigente.',
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

// Configuración de imágenes del slider
// Ajusta estas rutas según tu estructura de archivos
const SLIDER_IMAGES = {
  motocultores: [
    '/images/M04.png',
    '/images/M02.png',
    '/images/M03.png',
    '/images/M01.png',
  ],
  bombas: [
    '/images/B01.png',
    '/images/B02.png',
    '/images/B03.png',
    '/images/B04.png',
  ],
};

// Luminous aura that sits permanently behind the tractor image — no shape,
// no hard edges, just a diffuse golden glow (radial gradient fading to fully
// transparent + heavy blur) for a premium depth effect. Uses the same accent
// tone as the rest of the page so it doesn't drift orange. Pure inline styles
// (no Tailwind arbitrary values) so the large negative inset is guaranteed
// to render the same regardless of JIT/purge behavior.
const GlowAura = ({ active }: { active: boolean }) => (
  <motion.div
    style={{
      position: 'absolute',
      inset: '-20%',
      zIndex: 0,
      pointerEvents: 'none',
      borderRadius: '50%',
      background: 'radial-gradient(circle, var(--color-brand) 0%, var(--color-brand-secondary) 35%, transparent 70%)',
      filter: 'blur(45px)',
    }}
    initial={{ opacity: 0 }}
    animate={active ? { opacity: 0.95 } : { opacity: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  />
);

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
  const { setProductMode, isMotocultores, accentColor, accentColorRgb, buttonGradient, titleGradient } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visualHovered, setVisualHovered] = useState(false);

  // Refs for direct DOM manipulation — bypasses React render cycle entirely
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const heroRectRef = useRef<DOMRect | null>(null);
  const sliderTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep accent RGB accessible inside event handlers without closing over a stale value
  const accentRgbRef = useRef(accentColorRgb);
  useEffect(() => { accentRgbRef.current = accentColorRgb; }, [accentColorRgb]);

  // Obtener imágenes actuales según el modo
  const currentImages = isMotocultores ? SLIDER_IMAGES.motocultores : SLIDER_IMAGES.bombas;

  // Fade-in (fires once)
  useEffect(() => {
    const t1 = setTimeout(() => setIsVisible(true), 140);
    return () => clearTimeout(t1);
  }, []);

  // Mouse spotlight effect
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
      });
    };
    el.addEventListener('mousemove', handler);
    return () => { el.removeEventListener('mousemove', handler); cancelAnimationFrame(frame); };
  }, []);

  // Auto-slide con intervalo de 3 segundos
  useEffect(() => {
    // Reiniciar timer cuando cambian las imágenes (por cambio de modo)
    if (sliderTimerRef.current) {
      clearInterval(sliderTimerRef.current);
    }

    sliderTimerRef.current = setInterval(() => {
      goToNext();
    }, 3000);

    return () => {
      if (sliderTimerRef.current) {
        clearInterval(sliderTimerRef.current);
      }
    };
  }, [currentImages, isMotocultores]);

  // Resetear índice cuando cambia el modo
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [isMotocultores]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

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
        padding: 'clamp(4.5rem, 13vw, 6rem) 1.5rem 2.5rem',
        background: 'rgba(0,0,0,0.82)',
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
          maxWidth: '80rem', width: '100%', margin: '-80px auto 0',
          willChange: 'transform, opacity',
        }}
      >
        {/* ── Left: text ── */}
        <div className="hero-text">
          {/* Logo */}
          <a
            href="#inicio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              marginBottom: 'clamp(1.7rem, 6vw, 2.8rem)',
            }}
          >
            <div style={{ position: 'relative', width: '280px', height: '90px' }}>
              <Image
                src="/images/campo_maq_transparent.webp"
                alt="Logo Campomaq"
                fill
                sizes="(max-width: 768px) 200px, 280px"
                quality={95}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </a>

          {/* Category eyebrow */}
          <p style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: 'clamp(0.9rem, 3vw, 1.2rem)',
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
            marginBottom: 'clamp(1.1rem, 4vw, 1.8rem)',
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
            marginBottom: 'clamp(1.8rem, 6vw, 2.8rem)',
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

        {/* ── Right: Image Slider ── */}
        <div className="hero-visual-wrap">
          {/* Entrance — fade-in + slide in from the right on load */}
          <motion.div
            className="relative w-full mx-auto"
            style={{ aspectRatio: '1/1', maxWidth: '600px' }}
            initial={{ opacity: 0, x: 70 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Float layer — subtle continuous idle drift, independent of the entrance/hover transforms */}
            <div className="hero-visual-float w-full h-full">
            <div
              className="relative w-full h-full"
              onMouseEnter={() => setVisualHovered(true)}
              onMouseLeave={() => setVisualHovered(false)}
            >
              {/* Paint splash burst — reveals behind the tractor on hover */}
              <GlowAura active={true} />

              {/* Container de imágenes — hover: lift + scale, riding the splash reveal */}
              <motion.div
                className="relative z-10 w-full h-full"
                style={{
                  background: 'transparent',
                }}
                animate={visualHovered ? { scale: 1.05, y: -6 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >

              {/* Imágenes con transición */}
              {currentImages.map((src, index) => (
                <div
                  key={src}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: index === currentImageIndex ? 1 : 0,
                    transform: index === currentImageIndex ? 'scale(1)' : 'scale(1.05)',
                    transition: 'opacity 0.5s ease, transform 0.7s ease',
                    willChange: 'transform, opacity',
                  }}
                >
                  <img
                    src={src}
                    alt={`${c.category} - Imagen ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      // Scale M04.png by 10-15% (1.04 vs 0.92) and align it closer to the text (translateX 2% vs 4%)
                      transform: src === '/images/M04.png' 
                        ? 'scale(1.04) translateX(2%)' 
                        : 'scale(0.92) translateX(4%)',
                      // Enhanced shadow integration for premium realistic depth
                      filter: src === '/images/M04.png'
                        ? 'drop-shadow(0 15px 35px rgba(0,0,0,0.65)) drop-shadow(0 5px 15px rgba(0,0,0,0.3))'
                        : 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
                    }}
                    loading="lazy"
                  />
                </div>
              ))}

              {/* Controles del slider - solo en desktop (opcional) */}
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(12px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <button
                  onClick={goToPrevious}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Indicadores de slides */}
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {currentImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      style={{
                        width: idx === currentImageIndex ? '1.5rem' : '0.4rem',
                        height: '0.4rem',
                        borderRadius: '9999px',
                        border: 'none',
                        background: idx === currentImageIndex 
                          ? `rgba(${accentColorRgb},0.8)` 
                          : 'rgba(255,255,255,0.25)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      aria-label={`Ir a imagen ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
            </div>
            </div>
          </motion.div>
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