import React, { useRef, useState, useEffect } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { TelemetryLabel } from '../ui/TelemetryLabel';
import { MetricDisplay } from '../ui/MetricDisplay';
import { TechnicalDivider } from '../ui/TechnicalDivider';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const DurabilitySection: React.FC = () => {
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

  // Determine active biome state based on progress ranges
  // 0.00 – 0.33: Water (Active 0.08–0.28, Transition out 0.28–0.38)
  // 0.33 – 0.63: Snow (Transition in 0.28–0.38, Active 0.38–0.58, Transition out 0.58–0.68)
  // 0.63 – 1.00: Trail (Transition in 0.58–0.68, Active 0.68–0.90, End hold 0.90–1.00)
  const currentBiome: 'water' | 'snow' | 'trail' =
    progress < 0.33 ? 'water' : progress < 0.63 ? 'snow' : 'trail';

  // Smooth clip-path calculations for environmental wipes
  // 1. Snow clip wipe over Water (0.28 -> 0.38)
  const snowWipeProgress = Math.min(Math.max((progress - 0.28) / (0.38 - 0.28), 0), 1);
  const snowClipPercent = snowWipeProgress * 100;

  // 2. Trail clip wipe over Snow (0.58 -> 0.68)
  const trailWipeProgress = Math.min(Math.max((progress - 0.58) / (0.68 - 0.58), 0), 1);
  const trailClipPercent = trailWipeProgress * 100;

  // Layer transforms & parallax
  const waterScale = 1.0 + Math.min(progress / 0.35, 1) * 0.04;
  const snowScale = 1.06 - Math.min(Math.max((progress - 0.28) / 0.3, 0), 1) * 0.06;
  const trailScale = 1.07 - Math.min(Math.max((progress - 0.58) / 0.32, 0), 1) * 0.07;

  // Text visibility calculations (quick clip-out before incoming text appears)
  const waterTextOpacity = progress < 0.26 ? 1 : Math.max(1 - (progress - 0.26) / 0.05, 0);
  const waterTextTranslateY = progress < 0.26 ? 0 : -(progress - 0.26) * 120;

  const snowTextOpacity =
    progress < 0.33
      ? 0
      : progress < 0.38
      ? (progress - 0.33) / 0.05
      : progress < 0.56
      ? 1
      : Math.max(1 - (progress - 0.56) / 0.05, 0);
  const snowTextTranslateY =
    progress < 0.33
      ? 24
      : progress < 0.38
      ? (1 - (progress - 0.33) / 0.05) * 24
      : progress < 0.56
      ? 0
      : -(progress - 0.56) * 120;

  const trailTextOpacity =
    progress < 0.63 ? 0 : progress < 0.68 ? (progress - 0.63) / 0.05 : 1;
  const trailTextTranslateY =
    progress < 0.63 ? 24 : progress < 0.68 ? (1 - (progress - 0.63) / 0.05) * 24 : 0;

  const scrollToBiome = (targetBiome: 'water' | 'snow' | 'trail') => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;

    let targetP = 0.15;
    if (targetBiome === 'snow') targetP = 0.48;
    if (targetBiome === 'trail') targetP = 0.78;

    window.scrollTo({
      top: scrollTop + targetP * totalScrollable,
      behavior: 'smooth',
    });
  };

  // Reduced motion static fallback presentation
  if (prefersReducedMotion) {
    return (
      <section id="durability" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '32px' }}>
          <SectionLabel number="06" category="ELEMENTAL DURABILITY" />
          <h2 className="headline-lg" style={{ marginBottom: '8px' }}>
            BUILT FOR DEMANDING ENVIRONMENTS.
          </h2>
          <p className="body-large" style={{ maxWidth: '680px' }}>
            Factory-sealed chassis, hydrophobic optical elements, and cold-weather Enduro power allow you to record where other cameras cannot go.
          </p>
        </div>

        {/* Static Biome 01: Water */}
        <div
          style={{
            position: 'relative',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--biome-water-bg)',
            overflow: 'hidden',
            borderTop: '1px solid rgba(0, 210, 255, 0.2)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/action/durability-underwater.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(2, 20, 31, 0.95) 0%, rgba(2, 20, 31, 0.65) 50%, rgba(2, 20, 31, 0.2) 100%)',
            }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '560px' }}>
              <TelemetryLabel label="BIOME 01" value="UNDERWATER DEPTH" active />
              <div style={{ margin: '20px 0' }}>
                <MetricDisplay value="10M" unit="33FT" label="WATERPROOF RATING" accent />
              </div>
              <h3 className="headline-md" style={{ marginBottom: '8px' }}>
                WATERPROOF TO 33FT WITHOUT A HOUSING.
              </h3>
              <p className="body-base" style={{ marginBottom: '20px' }}>
                Factory-sealed architecture keeps water out in the heaviest surf and deep ocean dives.
              </p>
            </div>
          </div>
        </div>

        {/* Static Biome 02: Snow */}
        <div
          style={{
            position: 'relative',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--biome-snow-bg)',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/action/durability-snow.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(12, 16, 20, 0.95) 0%, rgba(12, 16, 20, 0.65) 50%, rgba(12, 16, 20, 0.2) 100%)',
            }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '560px' }}>
              <TelemetryLabel label="BIOME 02" value="SUB-ZERO GLACIER" active />
              <div style={{ margin: '20px 0' }}>
                <MetricDisplay value="-10°C" unit="14°F" label="ENDURO TEMPERATURE RATING" />
              </div>
              <h3 className="headline-md" style={{ marginBottom: '8px' }}>
                COLD DOESN'T STOP THE STORY.
              </h3>
              <p className="body-base" style={{ marginBottom: '20px' }}>
                Redesigned Enduro battery chemistry keeps the HERO13 Black operating in freezing conditions down to -10°C / 14°F.
              </p>
            </div>
          </div>
        </div>

        {/* Static Biome 03: Trail */}
        <div
          style={{
            position: 'relative',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--biome-trail-bg)',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/action/durability-trail.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(20, 14, 10, 0.95) 0%, rgba(20, 14, 10, 0.65) 50%, rgba(20, 14, 10, 0.2) 100%)',
            }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: '560px' }}>
              <TelemetryLabel label="BIOME 03" value="DIRT & ROCK TRAIL" active />
              <div style={{ margin: '20px 0' }}>
                <h3 className="display-hero" style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                  WATER. SNOW. DIRT. <br />
                  <span style={{ color: 'var(--biome-trail-accent)' }}>KEEP ROLLING.</span>
                </h3>
              </div>
              <p className="body-base" style={{ marginBottom: '20px' }}>
                Rugged adventure-ready construction with replaceable protective lens cover.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Scroll Sequence
  return (
    <section id="durability" className="durability-sequence" style={{ backgroundColor: 'var(--bg-canvas)' }}>
      {/* 1. Natural Flow Intro Header */}
      <div className="durability-intro container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <SectionLabel number="06" category="ELEMENTAL DURABILITY" />
        <h2 className="headline-lg" style={{ marginTop: '8px', marginBottom: '8px' }}>
          BUILT FOR DEMANDING ENVIRONMENTS.
        </h2>
        <p className="body-large" style={{ maxWidth: '680px', color: 'var(--text-secondary)' }}>
          Factory-sealed chassis, hydrophobic optical elements, and cold-weather Enduro power allow you to record where other cameras cannot go.
        </p>
      </div>

      {/* 2. Scroll Track with Sticky Biome Stage */}
      <div ref={trackRef} className="durability-scroll-track" style={{ position: 'relative', width: '100%' }}>
        <div
          className="durability-sticky-stage"
          style={{
            position: 'sticky',
            top: 'var(--nav-height)',
            height: 'calc(100vh - var(--nav-height))',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#02141F',
          }}
        >
          {/* BACKGROUND LAYER 01: WATER (Underneath Base) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/action/durability-underwater.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `scale(${waterScale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.1s linear',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(2, 20, 31, 0.95) 0%, rgba(2, 20, 31, 0.65) 50%, rgba(2, 20, 31, 0.2) 100%)',
            }}
          />

          {/* BACKGROUND LAYER 02: SNOW (Diagonal environmental wipe over Water) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath:
                snowWipeProgress <= 0
                  ? 'polygon(100% 0, 100% 0, 100% 0, 100% 0)'
                  : snowWipeProgress >= 1
                  ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                  : `polygon(${100 - snowClipPercent * 1.2}% 0, 100% 0, 100% 100%, ${100 - snowClipPercent * 0.8}% 100%)`,
              transition: 'clip-path 0.05s linear',
              zIndex: 2,
              backgroundColor: '#0C1014',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/action/durability-snow.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `scale(${snowScale})`,
                transformOrigin: 'center center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(12, 16, 20, 0.95) 0%, rgba(12, 16, 20, 0.65) 50%, rgba(12, 16, 20, 0.2) 100%)',
              }}
            />
          </div>

          {/* BACKGROUND LAYER 03: TRAIL (Physical momentum wipe over Snow) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath:
                trailWipeProgress <= 0
                  ? 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)'
                  : trailWipeProgress >= 1
                  ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                  : `polygon(${100 - trailClipPercent * 0.8}% 0, 100% 0, 100% 100%, ${100 - trailClipPercent * 1.2}% 100%)`,
              transition: 'clip-path 0.05s linear',
              zIndex: 3,
              backgroundColor: '#140E0A',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/action/durability-trail.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `scale(${trailScale})`,
                transformOrigin: 'center center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(20, 14, 10, 0.95) 0%, rgba(20, 14, 10, 0.65) 50%, rgba(20, 14, 10, 0.2) 100%)',
              }}
            />
          </div>

          {/* DYNAMIC CONTENT OVERLAYS CONTAINER */}
          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingTop: '24px',
              paddingBottom: '32px',
              pointerEvents: 'none',
            }}
          >
            {/* Top Bar: Floating Biome Selector Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', pointerEvents: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  backgroundColor: 'rgba(11, 13, 15, 0.75)',
                  padding: '4px',
                  borderRadius: 'var(--radius-default)',
                  border: '1px solid var(--border-subtle)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <button
                  onClick={() => scrollToBiome('water')}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.12em',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: currentBiome === 'water' ? 'var(--biome-water-bg)' : 'transparent',
                    color: currentBiome === 'water' ? 'var(--biome-water-accent)' : 'var(--text-muted)',
                    fontWeight: currentBiome === 'water' ? 700 : 500,
                    boxShadow: currentBiome === 'water' ? '0 0 10px rgba(0,210,255,0.3)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  01 // WATER (10M)
                </button>
                <button
                  onClick={() => scrollToBiome('snow')}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.12em',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: currentBiome === 'snow' ? 'var(--biome-snow-bg)' : 'transparent',
                    color: currentBiome === 'snow' ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: currentBiome === 'snow' ? 700 : 500,
                    boxShadow: currentBiome === 'snow' ? '0 0 10px rgba(255,255,255,0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  02 // SNOW (-10°C)
                </button>
                <button
                  onClick={() => scrollToBiome('trail')}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.12em',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: currentBiome === 'trail' ? 'var(--biome-trail-bg)' : 'transparent',
                    color: currentBiome === 'trail' ? 'var(--biome-trail-accent)' : 'var(--text-muted)',
                    fontWeight: currentBiome === 'trail' ? 700 : 500,
                    boxShadow: currentBiome === 'trail' ? '0 0 10px rgba(255,107,0,0.3)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  03 // TRAIL (RUGGED)
                </button>
              </div>

              {/* Progress Telemetry */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                SCROLL PROGRESS: {Math.round(progress * 100)}%
              </div>
            </div>

            {/* Mid-stage Content Area: Dynamic Stack */}
            <div style={{ position: 'relative', minHeight: '360px', display: 'flex', alignItems: 'center' }}>
              {/* 1. WATER OVERLAY */}
              <div
                style={{
                  position: 'absolute',
                  maxWidth: '560px',
                  opacity: waterTextOpacity,
                  transform: `translateY(${waterTextTranslateY}px)`,
                  pointerEvents: waterTextOpacity > 0.5 ? 'auto' : 'none',
                  transition: 'opacity 0.15s ease, transform 0.15s ease',
                }}
              >
                <TelemetryLabel label="BIOME 01" value="UNDERWATER DEPTH" active />

                <div style={{ margin: '20px 0' }}>
                  <MetricDisplay value="10M" unit="33FT" label="WATERPROOF RATING" accent />
                </div>

                <h3 className="headline-md" style={{ marginBottom: '8px' }}>
                  WATERPROOF TO 33FT WITHOUT A HOUSING.
                </h3>
                <p className="body-base" style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                  Factory-sealed architecture keeps water out in the heaviest surf and deep ocean dives. The hydrophobic lens cover sheds water droplets instantly for crystal-clear optics.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <TelemetryLabel label="HOUSING" value="NOT REQUIRED TO 10M" />
                  <TelemetryLabel label="LENS COVER" value="HYDROPHOBIC WATER-REPELLING" />
                </div>
              </div>

              {/* 2. SNOW OVERLAY */}
              <div
                style={{
                  position: 'absolute',
                  maxWidth: '560px',
                  opacity: snowTextOpacity,
                  transform: `translateY(${snowTextTranslateY}px)`,
                  pointerEvents: snowTextOpacity > 0.5 ? 'auto' : 'none',
                  transition: 'opacity 0.15s ease, transform 0.15s ease',
                }}
              >
                <TelemetryLabel label="BIOME 02" value="SUB-ZERO GLACIER" active />

                <div style={{ margin: '20px 0' }}>
                  <MetricDisplay value="-10°C" unit="14°F" label="ENDURO TEMPERATURE RATING" />
                </div>

                <h3 className="headline-md" style={{ marginBottom: '8px' }}>
                  COLD DOESN'T STOP THE STORY.
                </h3>
                <p className="body-base" style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                  Redesigned Enduro battery chemistry keeps the HERO13 Black operating in freezing conditions down to -10°C / 14°F so you never miss winter lines.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <TelemetryLabel label="BATTERY" value="ENDURO 1900MAH" active />
                  <TelemetryLabel label="THERMAL" value="FREEZE RESISTANT" />
                </div>
              </div>

              {/* 3. TRAIL OVERLAY */}
              <div
                style={{
                  position: 'absolute',
                  maxWidth: '560px',
                  opacity: trailTextOpacity,
                  transform: `translateY(${trailTextTranslateY}px)`,
                  pointerEvents: trailTextOpacity > 0.5 ? 'auto' : 'none',
                  transition: 'opacity 0.15s ease, transform 0.15s ease',
                }}
              >
                <TelemetryLabel label="BIOME 03" value="DIRT & ROCK TRAIL" active />

                <div style={{ margin: '20px 0' }}>
                  <h3 className="display-hero" style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', margin: 0 }}>
                    WATER. SNOW. DIRT. <br />
                    <span style={{ color: 'var(--biome-trail-accent)', display: 'inline-block', letterSpacing: '-0.02em' }}>
                      KEEP ROLLING.
                    </span>
                  </h3>
                </div>

                <p className="body-base" style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                  Rugged adventure-ready construction with replaceable protective lens cover and scratch-resistant optical glass engineered for high-impact singletrack.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <TelemetryLabel label="LENS COVER" value="USER REPLACEABLE" />
                  <TelemetryLabel label="DESIGN" value="RUGGED ADVENTURE READY" />
                </div>
              </div>
            </div>

            {/* Bottom HUD Information */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
              }}
            >
              <span>ENVIRONMENT: {currentBiome.toUpperCase()}</span>
              <span>
                {progress >= 0.9
                  ? 'SECTION RELEASE // HANDOFF TO MOUNTING ↓'
                  : 'SCROLL TO EXPLORE ENVIRONMENTAL TRANSITIONS ↓'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '32px' }}>
        <TechnicalDivider label="ELEMENTAL SEALING TESTED TO 10 METERS" />
      </div>

      <style>{`
        .durability-scroll-track {
          height: 380vh;
        }
        @media (max-width: 1024px) {
          .durability-scroll-track {
            height: 300vh;
          }
        }
        @media (max-width: 767px) {
          .durability-scroll-track {
            height: 250vh;
          }
        }
      `}</style>
    </section>
  );
};
