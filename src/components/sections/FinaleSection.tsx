import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { SectionLabel } from '../ui/SectionLabel';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const FinaleSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(trackRef);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  // 1. Ecosystem Convergence & Product Entrance (0.00 -> 0.22 spread, 0.22 -> 0.42 converge & enlarge)
  const entranceProgress = Math.min(progress / 0.42, 1);
  const entranceEased = 1 - Math.pow(1 - entranceProgress, 3);
  const productScale = 0.84 + entranceEased * 0.16; // 0.84 -> 1.00
  
  // Product lifts slightly (-2.5vh) during headline reveal (0.40 -> 0.62)
  const headlineLiftProgress = Math.min(Math.max((progress - 0.40) / 0.22, 0), 1);
  const headlineLiftEased = 1 - Math.pow(1 - headlineLiftProgress, 3);
  const productTranslateY = (1 - entranceEased) * 45 - headlineLiftEased * 22;

  // Center camera contrast/luminance emphasis as ecosystem converges (0.22 -> 0.42)
  const focusProgress = Math.min(Math.max((progress - 0.22) / 0.20, 0), 1);
  const productContrast = 1.0 + focusProgress * 0.08;
  const productBrightness = 1.0 + focusProgress * 0.05;

  // 2. Section Label Reveal (0.34 -> 0.44)
  const labelProgress = Math.min(Math.max((progress - 0.34) / 0.10, 0), 1);
  const labelEased = 1 - Math.pow(1 - labelProgress, 3);
  const labelOpacity = labelProgress > 0 ? labelEased : 0;
  const labelTranslateY = (1 - labelEased) * 14;

  // 3. Dual-Line Headline Reveal (Line 1: 0.40 -> 0.52, Line 2: 0.48 -> 0.60)
  const line1Progress = Math.min(Math.max((progress - 0.40) / 0.12, 0), 1);
  const line1Eased = 1 - Math.pow(1 - line1Progress, 3);
  const line1TranslateY = (1 - line1Eased) * 60;

  const line2Progress = Math.min(Math.max((progress - 0.48) / 0.12, 0), 1);
  const line2Eased = 1 - Math.pow(1 - line2Progress, 3);
  const line2TranslateY = (1 - line2Eased) * 60;

  // 4. Subtitle Reveal (0.56 -> 0.68)
  const subProgress = Math.min(Math.max((progress - 0.56) / 0.12, 0), 1);
  const subEased = 1 - Math.pow(1 - subProgress, 3);
  const subOpacity = subProgress > 0 ? subEased : 0;
  const subTranslateY = (1 - subEased) * 14;

  // 5. CTA Pair Entrance (0.64 -> 0.77)
  const ctaProgress = Math.min(Math.max((progress - 0.64) / 0.13, 0), 1);
  const ctaEased = 1 - Math.pow(1 - ctaProgress, 3);
  const ctaOpacity = ctaProgress > 0 ? ctaEased : 0;
  const ctaTranslateY = (1 - ctaEased) * 18;

  // 6. Options Rail Reveal (0.72 -> 0.84)
  const optionsProgress = Math.min(Math.max((progress - 0.72) / 0.12, 0), 1);
  const optionsEased = 1 - Math.pow(1 - optionsProgress, 3);
  const optionsOpacity = optionsProgress > 0 ? optionsEased : 0;
  const optionsTranslateY = (1 - optionsEased) * 12;

  // Reduced motion static fallback presentation
  if (prefersReducedMotion) {
    return (
      <section
        id="finale"
        className="section-stage bg-tactical-grid"
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: '80px',
          paddingBottom: '80px',
          backgroundColor: 'var(--bg-canvas)',
        }}
      >
        <div className="lens-glow" style={{ top: '30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px' }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SectionLabel number="09" category="FINALE" />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '750px',
              margin: '24px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/product/finale-hero-packout.png"
              alt="GoPro HERO13 Black and Ecosystem Packout in studio lighting"
              style={{
                width: '100%',
                maxHeight: '44vh',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9))',
              }}
            />
          </div>

          <h2 className="display-hero" style={{ marginBottom: '12px', maxWidth: '800px' }}>
            GO WHERE THE STORY IS.
          </h2>

          <p className="headline-md" style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '540px' }}>
            HERO13 BLACK // BUILT FOR WHAT'S NEXT.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
            <Button
              variant="gopro"
              size="lg"
              icon="shopping_bag"
              onClick={() => window.open('https://gopro.com', '_blank')}
            >
              [ BUY HERO13 ]
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon="description"
              onClick={() => {
                const el = document.getElementById('performance');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              [ EXPLORE FULL SPECS ]
            </Button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              padding: '12px 24px',
              backgroundColor: 'rgba(11, 13, 15, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-default)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
            }}
          >
            <span>OPTIONS:</span>
            <span style={{ color: 'var(--text-primary)' }}>STANDALONE CAMERA</span>
            <span>•</span>
            <span style={{ color: 'var(--text-primary)' }}>CREATOR EDITION</span>
            <span>•</span>
            <span style={{ color: 'var(--text-primary)' }}>HB-SERIES LENS BUNDLE</span>
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Sticky Scroll Finale Experience
  return (
    <section id="finale" className="finale-sequence bg-tactical-grid" style={{ backgroundColor: 'var(--bg-canvas)', position: 'relative' }}>
      <div className="lens-glow" style={{ top: '30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px' }} />

      {/* Scroll Track with Sticky Stage */}
      <div ref={trackRef} className="finale-scroll-track" style={{ position: 'relative', width: '100%' }}>
        <div
          className="finale-sticky-stage"
          style={{
            position: 'sticky',
            top: 'var(--nav-height)',
            height: 'calc(100vh - var(--nav-height))',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
              maxWidth: '900px',
            }}
          >
            {/* 1. Section Label (0.34 -> 0.44) */}
            <div
              style={{
                opacity: labelOpacity,
                transform: `translateY(${labelTranslateY}px)`,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                marginBottom: '8px',
              }}
            >
              <SectionLabel number="09" category="FINALE" />
            </div>

            {/* 2. Hero Packout Product Ecosystem Image (0.00 -> 0.42 convergence & enlargement) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '750px',
                margin: '4px 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${productScale}) translateY(${productTranslateY}px)`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s linear',
              }}
            >
              <img
                src="/assets/product/finale-hero-packout.png"
                alt="GoPro HERO13 Black and Ecosystem Packout in studio lighting"
                style={{
                  width: '100%',
                  maxHeight: '40vh',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 20px 50px rgba(0, 174, 239, 0.15)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9)) contrast(${productContrast}) brightness(${productBrightness})`,
                }}
              />
            </div>

            {/* 3. Dual-Line Monumental Headline (Line 1: 0.40 -> 0.52, Line 2: 0.48 -> 0.60) */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ overflow: 'hidden', display: 'block' }}>
                <h2
                  className="display-hero"
                  style={{
                    margin: 0,
                    lineHeight: 0.95,
                    letterSpacing: '-0.03em',
                    transform: `translateY(${line1TranslateY}px)`,
                    opacity: line1Progress > 0 ? 1 : 0,
                    transition: 'transform 0.1s linear',
                  }}
                >
                  GO WHERE THE
                </h2>
              </div>

              <div style={{ overflow: 'hidden', display: 'block', marginTop: '4px' }}>
                <h2
                  className="display-hero"
                  style={{
                    margin: 0,
                    lineHeight: 0.95,
                    letterSpacing: '-0.03em',
                    color: 'var(--gopro-blue)',
                    transform: `translateY(${line2TranslateY}px)`,
                    opacity: line2Progress > 0 ? 1 : 0,
                    transition: 'transform 0.1s linear',
                  }}
                >
                  STORY IS.
                </h2>
              </div>
            </div>

            {/* 4. Subtitle Reveal (0.56 -> 0.68) */}
            <p
              className="headline-md"
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '24px',
                maxWidth: '540px',
                opacity: subOpacity,
                transform: `translateY(${subTranslateY}px)`,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
            >
              HERO13 BLACK // BUILT FOR WHAT'S NEXT.
            </p>

            {/* 5. CTA Action Group (0.64 -> 0.77) */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '20px',
                opacity: ctaOpacity,
                transform: `translateY(${ctaTranslateY}px)`,
                pointerEvents: ctaOpacity > 0.5 ? 'auto' : 'none',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
            >
              <Button
                variant="gopro"
                size="lg"
                icon="shopping_bag"
                onClick={() => window.open('https://gopro.com', '_blank')}
              >
                [ BUY HERO13 ]
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="description"
                onClick={() => {
                  const el = document.getElementById('performance');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                [ EXPLORE FULL SPECS ]
              </Button>
            </div>

            {/* 6. Configuration Options Rail (0.72 -> 0.84) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                padding: '10px 20px',
                backgroundColor: 'rgba(11, 13, 15, 0.75)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-default)',
                backdropFilter: 'blur(12px)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
                opacity: optionsOpacity,
                transform: `translateY(${optionsTranslateY}px)`,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
            >
              <span style={{ color: 'var(--gopro-blue)', fontWeight: 700 }}>OPTIONS:</span>
              <span style={{ color: 'var(--text-primary)' }}>STANDALONE CAMERA</span>
              <span>•</span>
              <span style={{ color: 'var(--text-primary)' }}>CREATOR EDITION</span>
              <span>•</span>
              <span style={{ color: 'var(--text-primary)' }}>HB-SERIES LENS BUNDLE</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .finale-scroll-track {
          height: 200vh;
        }
        @media (max-width: 1024px) {
          .finale-scroll-track {
            height: 175vh;
          }
        }
        @media (max-width: 767px) {
          .finale-scroll-track {
            height: 155vh;
          }
        }
      `}</style>
    </section>
  );
};
