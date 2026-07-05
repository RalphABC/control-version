"use client";

import React, { useState } from 'react';

interface AccentButtonProps {
  href: string;
  /** CSS gradient used as the button background */
  gradient: string;
  /** Accent color as "r,g,b", used for the glow shadow */
  shadowRgb: string;
  external?: boolean;
  children: React.ReactNode;
}

/**
 * Solid gradient pill button with a hover lift + glow, shared by the
 * Hero and CTA primary actions.
 */
export const AccentButton = ({ href, gradient, shadowRgb, external = true, children }: AccentButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    // The hover scale/lift lives on the inner span, not this `<a>`. If the
    // `<a>` itself grew/shifted on hover, the browser re-hit-tests against
    // its new (transformed) box every frame of the transition — and since
    // the pointer doesn't move, that can flicker real mouseover/mouseout
    // events near the edge, which flips CustomCursor's hover-scale on and
    // off (visible as the icon "jumping"). Keeping the `<a>`'s box static
    // means its geometry never changes, so hover state stays stable.
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', textDecoration: 'none', borderRadius: '9999px' }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
        padding: '1.05rem 2.5rem',
        borderRadius: '9999px',
        fontSize: '0.85rem',
        fontWeight: 800,
        letterSpacing: '0.06em',
        color: '#000',
        background: gradient,
        boxShadow: hovered
          ? `0 16px 50px rgba(${shadowRgb},0.5), 0 4px 12px rgba(0,0,0,0.3)`
          : `0 8px 40px rgba(${shadowRgb},0.35), 0 2px 8px rgba(0,0,0,0.3)`,
        transform: hovered ? 'scale(1.07) translateY(-2px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, background 0.6s ease',
        fontFamily: 'inherit',
      }}>
        {children}
      </span>
    </a>
  );
};
