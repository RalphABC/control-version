"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, PhoneCall } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const Header = () => {
  const { accentColor, accentColorRgb } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Showcase 3D', href: '#showcase' },
    { name: 'Ficha Técnica', href: '#productos' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: scrolled ? '0.75rem 2rem' : '1.25rem 2rem',
        background: scrolled ? 'rgba(0, 0, 0, 0.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo and Brand */}
        <a
          href="#inicio"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div style={{ position: 'relative', width: '130px', height: '40px', transition: 'all 0.3s ease' }}>
            <Image
              src="/images/campomaq.png"
              alt="Logo Campomaq"
              fill
              sizes="(max-width: 768px) 130px, 130px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div
            style={{
              height: '20px',
              width: '1px',
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: accentColor,
              textShadow: `0 0 10px rgba(${accentColorRgb}, 0.3)`,
            }}
          >
            Titan PRO
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.textShadow = `0 0 8px rgba(${accentColorRgb}, 0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://wa.me/593980582555?text=Hola%20Campomaq,%20estoy%20interesado%20en%20adquirir%20el%20Motocultor%20Titan%20Pro%20de%2016%20HP.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20informaci%C3%B3n?"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              background: `rgba(${accentColorRgb}, 0.15)`,
              border: `1px solid ${accentColor}`,
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accentColor;
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = `0 0 15px rgba(${accentColorRgb}, 0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `rgba(${accentColorRgb}, 0.15)`;
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <PhoneCall size={12} />
            Cotizar
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="md:hidden"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            zIndex: 49,
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '0.5rem 0',
              }}
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://wa.me/593980582555?text=Hola%20Campomaq,%20estoy%20interesado%20en%20adquirir%20el%20Motocultor%20Titan%20Pro%20de%2016%20HP.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20informaci%C3%B3n?"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              background: accentColor,
              color: '#000',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              textDecoration: 'none',
              marginTop: '0.5rem',
            }}
          >
            <PhoneCall size={14} />
            Cotizar por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};
