import React, { useRef, useState, useEffect } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { TechnicalDivider } from '../ui/TechnicalDivider';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const PowerSection: React.FC = () => {
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

  const runtimeSpecs = [
    { metric: '2.5+ HOURS', mode: 'CONTINUOUS 1080P30', desc: 'Over 150 minutes of continuous recording runtime.' },
    { metric: '1.5+ HOURS', mode: 'CINEMATIC 5.3K30', desc: 'More than 90 minutes of maximum-resolution capture.' },
    { metric: 'DOWN TO -10°C', mode: '14°F SUB-ZERO PERFORMANCE', desc: 'Enduro chemistry maintains high discharge in extreme cold.' },
  ];

  // 1. Battery Docking Motion (0.18 -> 0.46 travel, 0.46 -> 0.54 snap connection)
  const travelProgress = Math.min(Math.max((progress - 0.18) / (0.46 - 0.18), 0), 1);
  const easedTravel = 1 - Math.pow(1 - travelProgress, 3);
  
  // Snap recoil at connection (0.46 -> 0.54)
  const snapProgress = Math.min(Math.max((progress - 0.46) / (0.54 - 0.46), 0), 1);
  const snapRecoil = snapProgress > 0 && snapProgress < 1 ? Math.sin(snapProgress * Math.PI) * 0.012 : 0;

  const batteryTranslateX = (1 - easedTravel) * 90; // 90px -> 0px
  const batteryTranslateY = (1 - easedTravel) * -14; // -14px -> 0px
  const cameraScale = 0.97 + easedTravel * 0.03 + snapRecoil;
  const cameraTranslateY = (1 - easedTravel) * 6;

  const isDocked = progress >= 0.50;

  // 2. Numerical Rolling Counter (0000 -> 1900 between progress 0.48 -> 0.64)
  const countProgress = Math.min(Math.max((progress - 0.48) / (0.64 - 0.48), 0), 1);
  const easedCount = 1 - Math.pow(1 - countProgress, 3);
  const displayCount = Math.round(easedCount * 1900);
  const formattedCount = countProgress < 1 ? displayCount.toString().padStart(4, '0') : '1900';

  // 3. Energy Field & Circuit Illumination (0.52 -> 0.70)
  const energyProgress = Math.min(Math.max((progress - 0.52) / (0.70 - 0.52), 0), 1);
  const circuitOpacity = 0.15 + energyProgress * 0.85; // 0.15 -> 1.0
  const energyFieldScale = 0.82 + energyProgress * 0.24; // 0.82 -> 1.06

  // 4. Runtime Cards Sequential Vertical Stagger (0.64 -> 0.84, strictly translateX = 0)
  const cardOpacities = [
    progress < 0.64 ? 0 : Math.min((progress - 0.64) / 0.06, 1),
    progress < 0.70 ? 0 : Math.min((progress - 0.70) / 0.06, 1),
    progress < 0.76 ? 0 : Math.min((progress - 0.76) / 0.06, 1),
  ];
  const cardTranslateYs = [
    progress < 0.64 ? 26 : (1 - Math.min((progress - 0.64) / 0.06, 1)) * 26,
    progress < 0.70 ? 34 : (1 - Math.min((progress - 0.70) / 0.06, 1)) * 34,
    progress < 0.76 ? 42 : (1 - Math.min((progress - 0.76) / 0.06, 1)) * 42,
  ];

  // Reduced motion static fallback presentation
  if (prefersReducedMotion) {
    return (
      <section id="power" className="section-stage bg-tactical-grid" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '32px' }}>
          <SectionLabel number="08" category="POWER ARCHITECTURE" />
          <h2 className="headline-lg" style={{ marginTop: '8px', marginBottom: '8px' }}>
            MORE POWER. LONGER RUNTIMES.
          </h2>
          <p className="body-large" style={{ maxWidth: '480px', marginBottom: '32px' }}>
            A higher-capacity 1900mAh Enduro battery combines with improved power efficiency to deliver significantly extended recording in all conditions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px', alignItems: 'center' }}>
            <div style={{ gridColumn: 'span 12' }} className="power-data-col">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                <span className="display-hero" style={{ color: 'var(--gopro-blue)', fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                  1900
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                  mAh
                </span>
              </div>
              <div className="power-runtime-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '480px' }}>
                {runtimeSpecs.map((item) => (
                  <div
                    key={item.mode}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-default)',
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gopro-blue)' }}>
                        {item.metric}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)' }}>
                        {item.mode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: 'span 12' }} className="power-visual-col">
              <img
                src="/assets/power/enduro-battery-dock.png"
                alt="GoPro HERO13 Enduro 1900mAh Battery"
                style={{ width: '100%', maxHeight: '48vh', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Sticky Scroll Experience
  return (
    <section id="power" className="power-sequence bg-tactical-grid" style={{ backgroundColor: 'var(--bg-canvas)', position: 'relative' }}>
      {/* Dynamic Background Energy Field */}
      <div
        className="lens-glow"
        style={{
          top: '35%',
          left: '20%',
          width: '500px',
          height: '500px',
          transform: `scale(${energyFieldScale})`,
          opacity: isDocked ? 0.9 : 0.45,
          transition: 'opacity 0.3s ease, transform 0.1s linear',
        }}
      />

      {/* Scroll Track with Sticky Stage */}
      <div ref={trackRef} className="power-scroll-track" style={{ position: 'relative', width: '100%' }}>
        <div
          className="power-sticky-stage"
          style={{
            position: 'sticky',
            top: 'var(--nav-height)',
            height: 'calc(100vh - var(--nav-height))',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ width: '100%', zIndex: 10 }}>
            {/* Top Telemetry Line */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
              }}
            >
              <span>POWER CELL // ENDURO ARCHITECTURE</span>
              <span style={{ color: isDocked ? 'var(--gopro-blue)' : 'var(--text-muted)', fontWeight: isDocked ? 700 : 500 }}>
                {isDocked
                  ? 'CIRCUIT ENGAGED // 1900MAH ACTIVE'
                  : 'DOCKING SEQUENCE // SCROLL TO INSERT ↓'}
              </span>
            </div>

            <div
              className="power-staging-box"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              {/* Left Column — 1900 mAh Focal Point & Specs */}
              <div style={{ gridColumn: 'span 12' }} className="power-data-col">
                <SectionLabel number="08" category="POWER ARCHITECTURE" />

                {/* Signature 1900 mAh Rolling Counter */}
                <div style={{ margin: '16px 0 8px 0' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '4px' }}>
                    REDESIGNED ENDURO POWER CELL
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span
                      className="display-hero"
                      style={{
                        color: 'var(--gopro-blue)',
                        fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        textShadow: countProgress > 0 ? '0 0 25px rgba(0, 174, 239, 0.4)' : 'none',
                        transition: 'text-shadow 0.3s ease',
                      }}
                    >
                      {formattedCount}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        opacity: countProgress >= 0.85 ? 1 : 0.4,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      mAh
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '8px', marginBottom: '20px' }}>
                  <h2 className="headline-lg" style={{ marginBottom: '6px' }}>
                    MORE POWER. LONGER RUNTIMES.
                  </h2>
                  <p className="body-large" style={{ maxWidth: '480px', color: 'var(--text-secondary)' }}>
                    A higher-capacity 1900mAh Enduro battery combines with improved power efficiency to deliver significantly extended recording in all conditions.
                  </p>
                </div>

                {/* Dedicated Shared Parent Stack with Perfectly Aligned Runtime Cards */}
                <div
                  className="power-runtime-stack"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '100%',
                    maxWidth: '480px',
                  }}
                >
                  {runtimeSpecs.map((item, idx) => (
                    <div
                      key={item.mode}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        marginLeft: 0,
                        marginRight: 0,
                        backgroundColor: 'var(--bg-surface)',
                        border: isDocked ? '1px solid rgba(0, 174, 239, 0.4)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-default)',
                        padding: '12px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        opacity: cardOpacities[idx],
                        transform: `translateY(${cardTranslateYs[idx]}px)`,
                        transition: 'border 0.3s ease',
                        boxShadow: isDocked ? '0 0 12px rgba(0, 174, 239, 0.12)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--gopro-blue)' }}>
                          {item.metric}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                          {item.mode}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column — Product & Docking Battery Visual */}
              <div style={{ gridColumn: 'span 12' }} className="power-visual-col">
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '380px',
                  }}
                >
                  {/* Base Product Staging Image with Docking Translation */}
                  <img
                    src="/assets/power/enduro-battery-dock.png"
                    alt="GoPro HERO13 Enduro 1900mAh Battery Docking into camera chassis"
                    style={{
                      width: '100%',
                      maxWidth: '640px',
                      maxHeight: '52vh',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.15)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9))',
                      transform: `scale(${cameraScale}) translate(${batteryTranslateX}px, ${batteryTranslateY + cameraTranslateY}px)`,
                      transformOrigin: 'center center',
                      transition: 'filter 0.3s ease',
                    }}
                  />

                  {/* Active Energy Circuit Overlay Glow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '8%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(0, 174, 239, 0.28) 0%, rgba(0, 174, 239, 0) 70%)',
                      opacity: circuitOpacity,
                      pointerEvents: 'none',
                      transition: 'opacity 0.2s linear',
                    }}
                  />

                  {/* Technical SVG PCB Data Path Overlay */}
                  <svg
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      opacity: circuitOpacity * 0.75,
                      transition: 'opacity 0.2s linear',
                    }}
                    viewBox="0 0 600 400"
                    fill="none"
                  >
                    <path
                      d="M 460 220 L 380 220 L 340 180 L 260 180"
                      stroke="var(--gopro-blue)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                    <circle cx="460" cy="220" r="3" fill="var(--gopro-blue)" />
                    <circle cx="260" cy="180" r="3" fill="var(--gopro-blue)" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <TechnicalDivider label="ADVANCED LI-ION ENDURO CHEMISTRY // 1900MAH CAPACITY" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .power-scroll-track {
          height: 240vh;
        }
        @media (max-width: 1024px) {
          .power-scroll-track {
            height: 200vh;
          }
        }
        @media (max-width: 767px) {
          .power-scroll-track {
            height: 180vh;
          }
        }

        @media (min-width: 992px) {
          .power-data-col {
            grid-column: span 5 !important;
          }
          .power-visual-col {
            grid-column: span 7 !important;
          }
        }
      `}</style>
    </section>
  );
};
