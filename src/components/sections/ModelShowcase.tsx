"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Model3D } from '@/components/ui/Model3D';

const specs = [
  { id: 'motor',     label: 'Motor',          value: '7 HP',              unit: 'Gasolina 4T',      x: 24, y: 63, dir: 'left'  as const, lineLen: 158, threshold: 0.10 },
  { id: 'cuchillas', label: 'Cuchillas',      value: 'Acero bicromatado', unit: 'Alta resistencia', x: 68, y: 74, dir: 'right' as const, lineLen: 148, threshold: 0.25 },
  { id: 'peso',      label: 'Peso neto',      value: '85 kg',             unit: 'Chasis reforzado', x: 26, y: 42, dir: 'left'  as const, lineLen: 136, threshold: 0.40 },
  { id: 'ancho',     label: 'Ancho de labor', value: '60–90 cm',          unit: 'Ajustable',        x: 70, y: 44, dir: 'right' as const, lineLen: 152, threshold: 0.55 },
  { id: 'manillar',  label: 'Manillar',       value: 'Ajustable',         unit: 'Ergonómico',       x: 28, y: 22, dir: 'left'  as const, lineLen: 142, threshold: 0.70 },
  { id: 'garantia',  label: 'Garantía',       value: '2 años',            unit: 'Respaldo oficial', x: 69, y: 24, dir: 'right' as const, lineLen: 130, threshold: 0.84 },
] as const;

/* ── Annotation ──────────────────────────────────────────────────────────────
   React.memo ensures it only re-renders when `visible` flips — at most once
   per spec during the entire showcase scroll-through.
   CSS transitions handle the visual animation at full 60fps on the GPU.
   ── */
interface AnnotationProps {
  label: string;
  value: string;
  unit: string;
  x: number;
  y: number;
  dir: 'left' | 'right';
  lineLen: number;
  visible: boolean;
  accentColor: string;
  accentColorRgb: string;
}

const Annotation = React.memo(function Annotation({
  label, value, unit, x, y, dir, lineLen, visible, accentColor, accentColorRgb,
}: AnnotationProps) {
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {/* Pulse ring */}
      <div style={{
        position: 'absolute',
        width: 22, height: 22, borderRadius: '50%',
        border: `1px solid rgba(${accentColorRgb},0.4)`,
        left: -11, top: -11,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        animation: visible ? 'cm-ping 2.2s ease-out infinite' : 'none',
      }} />

      {/* Center dot */}
      <div style={{
        position: 'absolute',
        width: 6, height: 6, borderRadius: '50%',
        background: accentColor,
        left: -3, top: -3,
        boxShadow: `0 0 8px rgba(${accentColorRgb},0.9)`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0)',
        transition: visible
          ? 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'
          : 'none',
      }} />

      {/* Line — width animates via CSS transition */}
      <div style={{
        position: 'absolute',
        top: -0.5,
        ...(dir === 'left' ? { right: 0 } : { left: 0 }),
        width: visible ? lineLen : 0,
        height: 1,
        background: dir === 'left'
          ? `linear-gradient(to left, ${accentColor}, rgba(${accentColorRgb},0.1))`
          : `linear-gradient(to right, ${accentColor}, rgba(${accentColorRgb},0.1))`,
        transition: visible ? 'width 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
        overflow: 'hidden',
      }} />

      {/* End tick */}
      <div style={{
        position: 'absolute',
        top: -4,
        ...(dir === 'left' ? { right: lineLen - 1 } : { left: lineLen - 1 }),
        width: 1, height: 9,
        background: accentColor,
        opacity: visible ? 0.7 : 0,
        transition: visible ? 'opacity 0.3s ease 0.65s' : 'none',
      }} />

      {/* Label block — fades in after line is drawn */}
      <div style={{
        position: 'absolute',
        top: -22,
        ...(dir === 'left'
          ? { right: lineLen + 10, textAlign: 'right' as const }
          : { left: lineLen + 10, textAlign: 'left' as const }),
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: visible
          ? 'opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s'
          : 'none',
        whiteSpace: 'nowrap',
      }}>
        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
          {label}
        </div>
        <div style={{ fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '0.66rem', color: accentColor, letterSpacing: '0.1em', fontWeight: 600, marginTop: '0.25rem', textTransform: 'uppercase' }}>
          {unit}
        </div>
      </div>
    </div>
  );
});

export const ModelShowcase = () => {
  const { accentColor, accentColorRgb, accentColorSecondary } = useTheme();

  // React state: ONLY for annotation visibility (max 6 discrete updates)
  const [shownCount, setShownCount] = useState(0);
  const shownCountRef = useRef(0);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Section geometry — updated once on mount + resize
  const sectionRef = useRef<HTMLElement>(null);
  const sectionTopRef = useRef(0);
  const scrollHeightRef = useRef(1);

  // scrollRef passed to Model3D — read by useFrame, never causes re-render
  const scrollRef = useRef(0);

  // Refs for continuous DOM updates (opacity, transform, content)
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const modelWrapRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const degreesTextRef = useRef<HTMLSpanElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const dialWrapRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const specCountRef = useRef<HTMLSpanElement>(null);
  const specCountWrapRef = useRef<HTMLDivElement>(null);

  // Compact single-card mode (mobile/tablet) — one spec at a time, cycling
  // through with its own appear/disappear fade instead of the scattered
  // constellation used on wider screens.
  const compactWrapRef = useRef<HTMLDivElement>(null);
  const compactIndexRef = useRef<HTMLSpanElement>(null);
  const compactLabelRef = useRef<HTMLSpanElement>(null);
  const compactValueRef = useRef<HTMLDivElement>(null);
  const compactUnitRef = useRef<HTMLDivElement>(null);
  const compactShownIndexRef = useRef(-1);

  // Measure section bounds once + on resize
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      sectionTopRef.current = rect.top + window.scrollY;
      scrollHeightRef.current = Math.max(1, el.offsetHeight - window.innerHeight);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Scroll handler — all continuous updates happen here via direct DOM, zero React re-renders
  useEffect(() => {
    const handler = () => {
      const raw = (window.scrollY - sectionTopRef.current) / scrollHeightRef.current;
      const p = Math.max(0, Math.min(1, raw));
      const deg = Math.round(p * 360);

      // Feed the Three.js loop
      scrollRef.current = p;

      // Background glow opacity
      if (glowRef.current) glowRef.current.style.opacity = String(0.11 + p * 0.89);

      // Grid overlay opacity
      if (gridRef.current) gridRef.current.style.opacity = String(0.25 + p * 0.65);

      // Model wrapper fade-in
      if (modelWrapRef.current) modelWrapRef.current.style.opacity = String(Math.min(p * 10, 1));

      // Eyebrow fade-in
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(Math.min(p * 8, 1));

      // Center title: fade in then out
      if (titleWrapRef.current) {
        const t = p < 0.5
          ? Math.max(0, Math.min(1, (p - 0.05) * 8))
          : Math.max(0, Math.min(1, (0.90 - p) * 8));
        titleWrapRef.current.style.opacity = String(t);
        titleWrapRef.current.style.transform = `translateY(${(p - 0.5) * -80}px)`;
      }

      // Degree counter
      if (degreesTextRef.current) degreesTextRef.current.textContent = `${deg}°`;
      if (needleRef.current) needleRef.current.style.transform = `rotate(${deg}deg)`;
      if (dialWrapRef.current) dialWrapRef.current.style.opacity = String(Math.min(p * 6, 1));

      // Progress bar
      if (progressFillRef.current) progressFillRef.current.style.height = `${p * 100}%`;
      if (progressBarRef.current) progressBarRef.current.style.opacity = String(Math.min(p * 8, 1));

      // Spec count text (direct update, no re-render)
      const shown = specs.filter(s => p >= s.threshold).length;
      if (specCountRef.current) specCountRef.current.textContent = `${shown} / ${specs.length}`;
      if (specCountWrapRef.current) specCountWrapRef.current.style.opacity = String(Math.min(p * 8, 1));

      // Trigger React state ONLY when a threshold crossing occurs (max 6 total updates)
      if (shown !== shownCountRef.current) {
        shownCountRef.current = shown;
        setShownCount(shown);
      }

      // Compact card (mobile/tablet): split the scroll range into one segment
      // per spec and fade the active one in, hold, then fade it out before
      // the next takes over. Hidden via CSS on wider screens, but the DOM
      // writes here are cheap enough to always run rather than branch on a
      // matchMedia check.
      const segLen = 1 / specs.length;
      const segPos = p / segLen;
      const idx = Math.max(0, Math.min(specs.length - 1, Math.floor(segPos)));
      const localT = segPos - idx;
      let cOpacity = 1;
      if (localT < 0.18) cOpacity = localT / 0.18;
      else if (localT > 0.82) cOpacity = (1 - localT) / 0.18;
      cOpacity = Math.max(0, Math.min(1, cOpacity));

      if (idx !== compactShownIndexRef.current) {
        compactShownIndexRef.current = idx;
        const spec = specs[idx];
        if (compactLabelRef.current) compactLabelRef.current.textContent = spec.label;
        if (compactValueRef.current) compactValueRef.current.textContent = spec.value;
        if (compactUnitRef.current) compactUnitRef.current.textContent = spec.unit;
        if (compactIndexRef.current) compactIndexRef.current.textContent = `0${idx + 1} / 0${specs.length}`;
      }
      if (compactWrapRef.current) {
        compactWrapRef.current.style.opacity = String(cOpacity);
        compactWrapRef.current.style.transform = `translate(-50%, -50%) translateY(${(1 - cOpacity) * 12}px)`;
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section ref={sectionRef} id="showcase" style={{ position: 'relative', height: '340vh' }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh', overflow: 'hidden',
        background: '#000',
      }}>
        {/* Glow — opacity driven via ref */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 100% 75% at 50% 50%, rgba(${accentColorRgb},0.18) 0%, transparent 65%)`,
            opacity: 0,
          }}
        />

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(${accentColorRgb},0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(${accentColorRgb},0.04) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            opacity: 0.25,
          }}
        />

        {/* Top edge accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1, pointerEvents: 'none',
          background: `linear-gradient(to right, transparent, rgba(${accentColorRgb},0.35), transparent)`,
        }} />

        {/* 3D canvas — opacity controlled via ref */}
        <div
          ref={modelWrapRef}
          style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 1 }}
        >
          {hasBeenVisible && (
            <Model3D
              scrollRef={scrollRef}
              autoRotate={false}
              modelScale={1.7}
              cameraZ={4.5}
              accentColor={accentColor}
              accentColorSecondary={accentColorSecondary}
            />
          )}
        </div>

        {/* Annotation lines — desktop/laptop only. Below 1024px they're swapped
            for the single cycling card (showcase-annotations-compact) since six
            scattered callouts don't fit a narrow screen without overlapping. */}
        <div className="showcase-annotations-desktop" style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
          {specs.map((spec, i) => (
            <Annotation
              key={spec.id}
              label={spec.label}
              value={spec.value}
              unit={spec.unit}
              x={spec.x}
              y={spec.y}
              dir={spec.dir}
              lineLen={spec.lineLen}
              visible={i < shownCount}
              accentColor={accentColor}
              accentColorRgb={accentColorRgb}
            />
          ))}
        </div>

        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            position: 'absolute', top: '2.2rem', left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center', zIndex: 6,
            opacity: 0, pointerEvents: 'none', whiteSpace: 'nowrap',
          }}
        >
          <p style={{
            fontSize: 'clamp(0.42rem, 1.8vw, 0.55rem)',
            letterSpacing: '0.45em',
            color: accentColor,
            textTransform: 'uppercase',
            fontWeight: 700,
            textShadow: `0 0 20px rgba(${accentColorRgb},0.9)`,
          }}>
            Diseño · Precisión · Durabilidad
          </p>
        </div>

        {/* Center title */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 3,
        }}>
          <div ref={titleWrapRef} style={{ textAlign: 'center', opacity: 0 }}>
            <h2 style={{
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 0.88,
              color: '#fff',
              textShadow: '0 2px 80px rgba(0,0,0,0.98), 0 0 150px rgba(0,0,0,0.9)',
            }}>
              AgroForce
            </h2>
            <div style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '0.25em',
              color: accentColor,
              textShadow: `0 0 50px rgba(${accentColorRgb},0.8)`,
              marginTop: '0.2rem',
            }}>
              700
            </div>
          </div>
        </div>

        {/* Degree counter + dial — desktop/laptop only, hidden in compact mode
            to leave room for the cycling spec card below. */}
        <div
          ref={dialWrapRef}
          className="showcase-dial"
          style={{
            position: 'absolute', bottom: '2.2rem', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: '1rem',
            zIndex: 6, pointerEvents: 'none', opacity: 0,
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            border: `1px solid rgba(${accentColorRgb},0.4)`,
            position: 'relative',
          }}>
            <div
              ref={needleRef}
              style={{
                position: 'absolute',
                width: 1.5, height: 13,
                background: `linear-gradient(to top, ${accentColor}, rgba(${accentColorRgb},0.3))`,
                borderRadius: 2,
                bottom: '50%', left: 'calc(50% - 0.75px)',
                transformOrigin: '50% 100%',
              }}
            />
            <div style={{
              position: 'absolute', inset: '38%', borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 8px rgba(${accentColorRgb},0.9)`,
            }} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
              <span ref={degreesTextRef}>0°</span>
            </div>
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>
              rotación
            </div>
          </div>
        </div>

        {/* Vertical progress bar */}
        <div
          ref={progressBarRef}
          style={{
            position: 'absolute', right: '1.8rem', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            zIndex: 6, opacity: 0,
          }}
        >
          <div style={{
            width: 1.5, height: 90,
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 2, overflow: 'hidden',
          }}>
            <div
              ref={progressFillRef}
              style={{
                width: '100%', height: '0%',
                background: `linear-gradient(to bottom, ${accentColor}, #F59E0B)`,
                boxShadow: `0 0 6px rgba(${accentColorRgb},0.7)`,
              }}
            />
          </div>
        </div>

        {/* Spec count — desktop/laptop only; the compact card shows its own
            index inline, so this would be redundant (and collide with the
            eyebrow) on narrow screens. */}
        <div
          ref={specCountWrapRef}
          className="showcase-speccount"
          style={{
            position: 'absolute', top: '2rem', right: '2.5rem',
            zIndex: 6, pointerEvents: 'none',
            textAlign: 'right', opacity: 0,
          }}
        >
          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
            Especificaciones
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: accentColor }}>
            <span ref={specCountRef}>0 / {specs.length}</span>
          </div>
        </div>

        {/* Compact spec card — mobile/tablet only. One characteristic at a
            time, larger and centered, fading in/out as the scroll segment
            for each spec is entered/left (see the scroll handler above). */}
        <div
          ref={compactWrapRef}
          className="showcase-annotations-compact"
          style={{
            position: 'absolute', top: '70%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(88vw, 22rem)',
            textAlign: 'center',
            zIndex: 7, pointerEvents: 'none', opacity: 0,
          }}
        >
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: accentColor, marginBottom: '0.6rem',
          }}>
            <span ref={compactIndexRef}>01 / 06</span>
            {' · '}
            <span ref={compactLabelRef}>Motor</span>
          </div>
          <div ref={compactValueRef} style={{
            fontSize: 'clamp(1.9rem, 9vw, 2.6rem)', fontWeight: 900, color: '#fff',
            letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '0.5rem',
          }}>
            7 HP
          </div>
          <div ref={compactUnitRef} style={{
            fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)',
            fontWeight: 600, letterSpacing: '0.06em',
          }}>
            Gasolina 4T
          </div>
        </div>

        {/* Bottom edge accent */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, pointerEvents: 'none',
          background: `linear-gradient(to right, transparent, rgba(${accentColorRgb},0.25), transparent)`,
        }} />
      </div>
    </section>
  );
};
