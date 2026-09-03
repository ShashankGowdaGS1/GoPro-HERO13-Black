import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

export const ProductNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { id: 'hero', label: 'Overview' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'performance', label: 'Performance' },
    { id: 'lenses', label: 'Lenses' },
    { id: 'stabilization', label: 'Stabilization' },
    { id: 'durability', label: 'Durability' },
    { id: 'mounting', label: 'Mounting' },
    { id: 'power', label: 'Power' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Simple active link detection
      const scrollPosition = window.scrollY + 200;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 'clamp(1rem, 3vw, 2.5rem)',
        paddingRight: 'clamp(1rem, 3vw, 2.5rem)',
        backgroundColor: isScrolled ? 'rgba(5, 6, 7, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'all var(--transition-default)',
      }}
    >
      {/* Brand & Badge */}
      <a
        href="#hero"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          color: 'var(--text-primary)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
          }}
        >
          GoPro
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.12em',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            textTransform: 'uppercase',
          }}
        >
          HERO13 BLACK
        </span>
      </a>

      {/* Desktop Links */}
      <nav
        style={{
          display: 'none',
        }}
        className="desktop-nav"
      >
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            listStyle: 'none',
          }}
        >
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: activeSection === link.id ? 'var(--gopro-blue)' : 'var(--text-secondary)',
                  borderBottom: activeSection === link.id ? '2px solid var(--gopro-blue)' : '2px solid transparent',
                  paddingBottom: '4px',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Action CTA & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="#finale" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="sm">
            [ BUY HERO13 ]
          </Button>
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-nav-toggle"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: activeSection === link.id ? 'var(--gopro-blue)' : 'var(--text-primary)',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
