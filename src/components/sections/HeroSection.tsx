import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { TelemetryLabel } from '../ui/TelemetryLabel';
import { HeroProduct3D } from '../3d/HeroProduct3D';
import { HeroFilmModal } from '../media/HeroFilmModal';

export const HeroSection: React.FC = () => {
  const [isFilmModalOpen, setIsFilmModalOpen] = useState<boolean>(false);

  return (
    <section
      id="hero"
      className="section-stage bg-tactical-grid"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'calc(var(--nav-height) + 24px)',
        paddingBottom: '48px',
        overflow: 'hidden',
      }}
    >
      <div className="lens-glow" style={{ top: '25%', right: '15%', width: '500px', height: '500px' }} />

      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '32px',
          alignItems: 'center',
          flex: 1,
          zIndex: 10,
        }}
      >
        {/* Left Column (40–45% width on Desktop, order 2 on mobile) */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
          }}
          className="hero-copy-col"
        >
          {/* Phase 1: SYSTEM Label (Starts at 0.0s) */}
          <div className="hero-anim-system" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <TelemetryLabel
              label="SYSTEM"
              value="HERO13 BLACK // 5.3K60 // 10M WATERPROOF"
              icon="terminal"
              active
            />
          </div>

          {/* Phase 2: HERO13 / BLACK Architectural Mask Reveal */}
          <div>
            <div style={{ overflow: 'hidden', display: 'block' }}>
              <h1
                className="display-hero hero-anim-headline-1"
                style={{
                  margin: 0,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  display: 'block',
                }}
              >
                HERO13
              </h1>
            </div>

            <div style={{ overflow: 'hidden', display: 'block', marginTop: '4px' }}>
              <h1
                className="display-hero hero-anim-headline-2"
                style={{
                  margin: 0,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: 'var(--gopro-blue)',
                  display: 'block',
                }}
              >
                BLACK
              </h1>
            </div>

            {/* Phase 3: Supporting Headline (Starts at ~0.65s) */}
            <p
              className="headline-md hero-anim-subhead"
              style={{
                color: 'var(--text-secondary)',
                maxWidth: '480px',
                marginTop: '16px',
                marginBottom: 0,
              }}
            >
              BUILT TO CAPTURE THE IMPOSSIBLE.
            </p>
          </div>

          {/* Phase 4: CTA Buttons (Starts at ~0.95s) */}
          <div
            className="hero-anim-ctas"
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '12px',
            }}
          >
            <a href="#engineering" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg" icon="arrow_forward">
                [ EXPLORE HERO13 ]
              </Button>
            </a>
            <Button
              variant="secondary"
              size="lg"
              icon="play_arrow"
              onClick={() => setIsFilmModalOpen(true)}
            >
              [ WATCH FILM ]
            </Button>
          </div>
        </div>

        {/* Right Column (55–60% width on Desktop, order 1 on mobile) — Interactive 3D Model */}
        <div
          style={{
            gridColumn: 'span 12',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hero-visual-col"
        >
          <HeroProduct3D fallbackImage="/assets/product/hero-camera.png" />
        </div>
      </div>

      {/* Phase 5: Bottom Telemetry HUD (Starts at ~1.25s) */}
      <div
        className="container hero-anim-telemetry"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.14em',
          color: 'var(--text-muted)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--gopro-blue)' }}>
            location_on
          </span>
          <span>LAT: 45.9237° N // LON: 6.8694° E</span>
        </div>

        <a
          href="#engineering"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'var(--gopro-blue)',
            fontWeight: 600,
          }}
        >
          <span>SCROLL // 01 ARCHITECTURE</span>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
            keyboard_arrow_down
          </span>
        </a>
      </div>

      {/* Hero Cinematic Film Modal */}
      <HeroFilmModal
        isOpen={isFilmModalOpen}
        onClose={() => setIsFilmModalOpen(false)}
      />

      <style>{`
        /* Hero Choreographed Text Entrance Animations */
        .hero-anim-system {
          animation: heroFadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }

        .hero-anim-headline-1 {
          animation: heroMaskReveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }

        .hero-anim-headline-2 {
          animation: heroMaskReveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both;
        }

        .hero-anim-subhead {
          animation: heroFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
        }

        .hero-anim-ctas {
          animation: heroFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.92s both;
        }

        .hero-anim-telemetry {
          animation: heroFade 0.6s ease-out 1.25s both;
        }

        @keyframes heroMaskReveal {
          0% {
            transform: translateY(115%);
            letter-spacing: 0.02em;
          }
          100% {
            transform: translateY(0%);
            letter-spacing: -0.03em;
          }
        }

        @keyframes heroFadeUp {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @media (min-width: 992px) {
          .hero-copy-col {
            grid-column: span 5 !important;
            order: 1 !important;
          }
          .hero-visual-col {
            grid-column: span 7 !important;
            order: 2 !important;
          }
        }
        @media (max-width: 991px) {
          .hero-copy-col {
            order: 2 !important;
            margin-top: 16px;
          }
          .hero-visual-col {
            order: 1 !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-anim-system,
          .hero-anim-headline-1,
          .hero-anim-headline-2,
          .hero-anim-subhead,
          .hero-anim-ctas,
          .hero-anim-telemetry {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
};
