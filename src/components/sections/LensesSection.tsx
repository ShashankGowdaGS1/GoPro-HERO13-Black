import React, { useRef, useState, useEffect } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { TelemetryLabel } from '../ui/TelemetryLabel';
import { TechnicalDivider } from '../ui/TechnicalDivider';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const LensesSection: React.FC = () => {
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

  // Preload all 4 lens assets
  useEffect(() => {
    const imagePaths = [
      '/assets/lenses/hero13-ultra-wide.webp',
      '/assets/lenses/hero13-macro.webp',
      '/assets/lenses/hero13-anamorphic.webp',
      '/assets/lenses/hero13-nd-filters.webp',
    ];
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);

  // 4 Lens Definitions with full telemetry
  const mods = [
    {
      id: 'ultra-wide',
      tabLabel: '01 ULTRA WIDE',
      title: 'ULTRA WIDE LENS MOD',
      keyMetric: '177° MAX FOV',
      subMetric: '360° HORIZON LOCK',
      description: 'Expands your field of view up to 177° with automatic sensor calibration and complete horizon stabilization.',
      specs: 'AUTO-DETECT ENGAGED // ASPECT: 16:9 // FOV: 177°',
      image: '/assets/lenses/hero13-ultra-wide.webp',
    },
    {
      id: 'macro',
      tabLabel: '02 MACRO',
      title: 'MACRO LENS MOD',
      keyMetric: '4X CLOSER',
      subMetric: 'VARIABLE FOCUS RING',
      description: 'Get up to 4 times closer to your subject with manual rotating focus ring and automated focus peaking on the display.',
      specs: 'MIN FOCUS: 11CM // MAGNIFICATION: 0.33X // PEAKING: ON',
      image: '/assets/lenses/hero13-macro.webp',
    },
    {
      id: 'anamorphic',
      tabLabel: '03 ANAMORPHIC',
      title: 'ANAMORPHIC LENS MOD',
      keyMetric: '21:9 RATIO',
      subMetric: 'IN-CAMERA DE-SQUEEZE',
      description: 'Capture cinematic ultra-wide footage with signature lens flares and real-time in-camera de-squeezing.',
      specs: 'SQUEEZE FACTOR: 1.33X // ASPECT: 21:9 CINEMATIC',
      image: '/assets/lenses/hero13-anamorphic.webp',
    },
    {
      id: 'nd',
      tabLabel: '04 ND FILTERS',
      title: 'SMART ND 4-PACK',
      keyMetric: 'AUTO SHUTTER',
      subMetric: 'ND4 / ND8 / ND16 / ND32',
      description: 'Camera automatically identifies each filter and calibrates optimal shutter angle for natural cinematic motion blur.',
      specs: 'DETECTION: AUTOMATIC // SHUTTER ANGLE: 180° LOCK',
      image: '/assets/lenses/hero13-nd-filters.webp',
    },
  ];

  // Normalized progress mapping:
  // 0.00 – 0.23: Ultra Wide (active 0.07–0.23, exit 0.23–0.30)
  // 0.23 – 0.49: Macro (enter 0.23–0.30, active 0.30–0.45, exit 0.45–0.52)
  // 0.49 – 0.72: Anamorphic (enter 0.45–0.52, active 0.52–0.68, exit 0.68–0.75)
  // 0.72 – 1.00: ND Filters (enter 0.68–0.75, active 0.75–0.91, hold 0.91–1.00)
  const activeModIndex =
    progress < 0.265 ? 0 : progress < 0.505 ? 1 : progress < 0.735 ? 2 : 3;
  const activeMod = mods[activeModIndex];

  // Transition calculations:
  // 1. Ultra Wide -> Macro (0.23 -> 0.30)
  const macroWipe = Math.min(Math.max((progress - 0.23) / 0.07, 0), 1);
  // 2. Macro -> Anamorphic (0.45 -> 0.52)
  const anamorphicWipe = Math.min(Math.max((progress - 0.45) / 0.07, 0), 1);
  // 3. Anamorphic -> ND (0.68 -> 0.75)
  const ndWipe = Math.min(Math.max((progress - 0.68) / 0.07, 0), 1);

  // Micro scale and transform motions
  const ultraWideScale = 1.06 - Math.min(progress / 0.23, 1) * 0.06;
  const ultraWideTranslateX = Math.max(0, (0.07 - progress) / 0.07) * 30;

  const macroScale =
    progress < 0.23
      ? 0.94
      : progress < 0.45
      ? 0.94 + ((progress - 0.23) / 0.22) * 0.10
      : 1.04;

  const anamorphicExpand =
    progress < 0.45
      ? 0
      : progress < 0.68
      ? ((progress - 0.45) / 0.23) * 1.03
      : 1.03;

  const ndStagger = Math.min(Math.max((progress - 0.68) / 0.12, 0), 1);

  // Text opacities and offsets
  const textOpacities = [
    progress < 0.22 ? 1 : Math.max(1 - (progress - 0.22) / 0.04, 0),
    progress < 0.27
      ? 0
      : progress < 0.31
      ? (progress - 0.27) / 0.04
      : progress < 0.44
      ? 1
      : Math.max(1 - (progress - 0.44) / 0.04, 0),
    progress < 0.49
      ? 0
      : progress < 0.53
      ? (progress - 0.49) / 0.04
      : progress < 0.67
      ? 1
      : Math.max(1 - (progress - 0.67) / 0.04, 0),
    progress < 0.72 ? 0 : progress < 0.76 ? (progress - 0.72) / 0.04 : 1,
  ];

  const textTranslates = [
    progress < 0.22 ? 0 : -(progress - 0.22) * 120,
    progress < 0.27
      ? 20
      : progress < 0.31
      ? (1 - (progress - 0.27) / 0.04) * 20
      : progress < 0.44
      ? 0
      : -(progress - 0.44) * 120,
    progress < 0.49
      ? 20
      : progress < 0.53
      ? (1 - (progress - 0.49) / 0.04) * 20
      : progress < 0.67
      ? 0
      : -(progress - 0.67) * 120,
    progress < 0.72 ? 20 : progress < 0.76 ? (1 - (progress - 0.72) / 0.04) * 20 : 0,
  ];

  // Click-to-scroll handler
  const scrollToMod = (index: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;

    const targets = [0.08, 0.34, 0.56, 0.79];
    window.scrollTo({
      top: scrollTop + targets[index] * totalScrollable,
      behavior: 'smooth',
    });
  };

  // Reduced motion static fallback presentation
  if (prefersReducedMotion) {
    return (
      <section id="lenses" className="section-stage bg-tactical-grid" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '32px' }}>
          <SectionLabel number="04" category="OPTICAL ECOSYSTEM" />
          <h2 className="headline-lg" style={{ marginBottom: '8px' }}>
            CHANGE YOUR PERSPECTIVE.
          </h2>
          <p className="body-large" style={{ maxWidth: '640px', marginBottom: '40px' }}>
            HB-Series Smart Lenses. Snap on. Auto-detect. Instant transformation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {mods.map((mod) => (
              <div
                key={mod.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                }}
              >
                <img
                  src={mod.image}
                  alt={mod.title}
                  style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '16px' }}
                />
                <TelemetryLabel label="HB-SERIES" value="AUTO-DETECT" active />
                <h3 className="headline-sm" style={{ marginTop: '12px', marginBottom: '4px' }}>
                  {mod.title}
                </h3>
                <div style={{ color: 'var(--gopro-blue)', fontWeight: 700, marginBottom: '8px' }}>
                  {mod.keyMetric} // {mod.subMetric}
                </div>
                <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                  {mod.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Sticky Scroll Experience
  return (
    <section id="lenses" className="lenses-sequence bg-tactical-grid" style={{ backgroundColor: 'var(--bg-canvas)', position: 'relative' }}>
      <div className="lens-glow" style={{ top: '40%', right: '25%', width: '450px', height: '450px' }} />

      {/* 1. Natural Flow Intro Header */}
      <div className="lenses-intro container" style={{ paddingTop: '80px', paddingBottom: '32px', zIndex: 10 }}>
        <SectionLabel number="04" category="OPTICAL ECOSYSTEM" />
        <h2 className="headline-lg" style={{ marginTop: '8px', marginBottom: '8px' }}>
          CHANGE YOUR PERSPECTIVE.
        </h2>
        <p className="body-large" style={{ maxWidth: '640px', color: 'var(--text-secondary)' }}>
          HB-Series Smart Lenses. Snap on. Auto-detect. Instant transformation. HERO13 Black automatically switches settings when a lens is attached.
        </p>
      </div>

      {/* 2. Scroll Track with Sticky Stage */}
      <div ref={trackRef} className="lenses-scroll-track" style={{ position: 'relative', width: '100%' }}>
        <div
          className="lenses-sticky-stage"
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
            {/* Top Bar: Floating Lens Selector Tabs */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  backgroundColor: 'rgba(11, 13, 15, 0.75)',
                  padding: '4px',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--border-subtle)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {mods.map((mod, idx) => (
                  <button
                    key={mod.id}
                    onClick={() => scrollToMod(idx)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: activeModIndex === idx ? '1px solid var(--gopro-blue)' : '1px solid transparent',
                      backgroundColor: activeModIndex === idx ? 'var(--bg-raised)' : 'transparent',
                      color: activeModIndex === idx ? 'var(--text-primary)' : 'var(--text-muted)',
                      boxShadow: activeModIndex === idx ? '0 0 12px var(--gopro-blue-glow)' : 'none',
                      fontWeight: activeModIndex === idx ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {mod.tabLabel}
                  </button>
                ))}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                ECOSYSTEM: {activeMod.title} // {Math.round(progress * 100)}%
              </div>
            </div>

            {/* Split Staging Container */}
            <div
              className="lens-staging-box"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '24px',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                minHeight: '480px',
                position: 'relative',
              }}
            >
              {/* Left Column: Dynamic Copy Stack */}
              <div style={{ gridColumn: 'span 12', position: 'relative', minHeight: '260px' }} className="lens-data-col">
                {mods.map((mod, idx) => (
                  <div
                    key={mod.id}
                    style={{
                      position: idx === 0 ? 'relative' : 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      opacity: textOpacities[idx],
                      transform: `translateY(${textTranslates[idx]}px)`,
                      pointerEvents: textOpacities[idx] > 0.5 ? 'auto' : 'none',
                      transition: 'opacity 0.15s ease, transform 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'inline-block', marginBottom: '8px' }}>
                      <TelemetryLabel label="HB-SERIES" value="AUTO-DETECTION" active />
                    </div>

                    <h3 className="headline-md" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {mod.title}
                    </h3>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginBottom: '16px' }}>
                      <span className="headline-lg" style={{ color: 'var(--gopro-blue)', letterSpacing: '-0.02em' }}>
                        {mod.keyMetric}
                      </span>
                      <span className="label-mono-sm" style={{ color: 'var(--text-muted)' }}>
                        // {mod.subMetric}
                      </span>
                    </div>

                    <p className="body-base" style={{ maxWidth: '420px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
                      {mod.description}
                    </p>

                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.12em',
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        maxWidth: '440px',
                      }}
                    >
                      {mod.specs}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: 4 Distinct Layered Visual Assets with Physical Masking */}
              <div
                style={{
                  gridColumn: 'span 12',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  minHeight: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="lens-visual-col"
              >
                {/* 1. ULTRA WIDE IMAGE (Base Layer) */}
                <img
                  src="/assets/lenses/hero13-ultra-wide.webp"
                  alt="GoPro HERO13 with HB-Series Ultra Wide Lens Mod"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    maxWidth: '620px',
                    maxHeight: '48vh',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
                    transform: `scale(${ultraWideScale}) translateX(${ultraWideTranslateX}px)`,
                    transformOrigin: 'center center',
                    zIndex: 1,
                  }}
                />

                {/* 2. MACRO IMAGE (Vertical Wipe Reveal from Right) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    clipPath:
                      macroWipe <= 0
                        ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
                        : macroWipe >= 1
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        : `polygon(${100 - macroWipe * 100}% 0, 100% 0, 100% 100%, ${100 - macroWipe * 100}% 100%)`,
                    zIndex: 2,
                  }}
                >
                  <img
                    src="/assets/lenses/hero13-macro.webp"
                    alt="GoPro HERO13 with HB-Series Macro Lens Mod"
                    style={{
                      width: '100%',
                      maxWidth: '620px',
                      maxHeight: '48vh',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
                      transform: `scale(${macroScale})`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>

                {/* 3. ANAMORPHIC IMAGE (Horizontal Aperture Expansion Mask from Center) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    clipPath:
                      anamorphicWipe <= 0
                        ? 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)'
                        : anamorphicWipe >= 1
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        : `polygon(${50 - anamorphicWipe * 50}% 0, ${50 + anamorphicWipe * 50}% 0, ${50 + anamorphicWipe * 50}% 100%, ${50 - anamorphicWipe * 50}% 100%)`,
                    zIndex: 3,
                  }}
                >
                  <img
                    src="/assets/lenses/hero13-anamorphic.webp"
                    alt="GoPro HERO13 with HB-Series Anamorphic Lens Mod"
                    style={{
                      width: '100%',
                      maxWidth: '620px',
                      maxHeight: '48vh',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.15)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
                      transform: `scale(${anamorphicExpand})`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>

                {/* 4. ND FILTERS IMAGE (Segmented Exposure Mask with Filter Alignment) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    clipPath:
                      ndWipe <= 0
                        ? 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)'
                        : ndWipe >= 1
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        : `polygon(${100 - ndWipe * 100}% 0, 100% 0, 100% 100%, ${100 - ndWipe * 90}% 100%)`,
                    zIndex: 4,
                  }}
                >
                  <img
                    src="/assets/lenses/hero13-nd-filters.webp"
                    alt="GoPro HERO13 with HB-Series Smart ND Filters"
                    style={{
                      width: '100%',
                      maxWidth: '620px',
                      maxHeight: '48vh',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
                      transform: `translateX(${(1 - ndStagger) * 12}px)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '32px' }}>
        <TechnicalDivider label="HB-SERIES MAGNETIC BAYONET OPTICAL INTERFACE" />
      </div>

      <style>{`
        .lenses-scroll-track {
          height: 420vh;
        }
        @media (max-width: 1024px) {
          .lenses-scroll-track {
            height: 340vh;
          }
        }
        @media (max-width: 767px) {
          .lenses-scroll-track {
            height: 280vh;
          }
        }

        @media (min-width: 992px) {
          .lens-data-col {
            grid-column: span 5 !important;
          }
          .lens-visual-col {
            grid-column: span 7 !important;
          }
        }
      `}</style>
    </section>
  );
};
