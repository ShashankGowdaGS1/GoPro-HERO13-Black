import React, { useRef, useState, useEffect } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { TelemetryLabel } from '../ui/TelemetryLabel';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const PerformanceSection: React.FC = () => {
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

  const specs = [
    { label: '5.3K60', desc: 'High-Resolution Master' },
    { label: '4K120', desc: '4X Cinematic Slo-Mo' },
    { label: '900P360', desc: '12X High-Speed Burst' },
    { label: '10-BIT HLG', desc: '1 Billion Colors HDR' },
  ];

  // 1. Chapter Label & Metric Label (0.08 -> 0.20)
  const labelProgress = Math.min(Math.max((progress - 0.08) / 0.12, 0), 1);
  const labelEased = 1 - Math.pow(1 - labelProgress, 3);
  const labelClip = (1 - labelEased) * 100;
  const labelTracking = 0.16 + (1 - labelEased) * 0.04;
  const labelTranslateX = (1 - labelEased) * -14;

  // 2. 400 FPS — Main Event (0.14 -> 0.34)
  // "400": 0.14 -> 0.30
  const progress400 = Math.min(Math.max((progress - 0.14) / 0.16, 0), 1);
  const eased400 = 1 - Math.pow(1 - progress400, 3);
  const overshoot400 = progress400 > 0.6 && progress400 < 1 ? Math.sin((progress400 - 0.6) / 0.4 * Math.PI) * 0.025 : 0;
  const scale400 = 0.90 + eased400 * 0.10 + overshoot400;
  const translateY400 = (1 - eased400) * 70;
  const clip400 = (1 - eased400) * 100;

  // "FPS": arrives 6-8% later (0.20 -> 0.34)
  const progressFps = Math.min(Math.max((progress - 0.20) / 0.14, 0), 1);
  const easedFps = 1 - Math.pow(1 - progressFps, 3);
  const translateXFps = (1 - easedFps) * -22;
  const clipFps = (1 - easedFps) * 100;

  // 3. Supporting Line below 400 (0.26 -> 0.40)
  const subProgress = Math.min(Math.max((progress - 0.26) / 0.14, 0), 1);
  const subEased = 1 - Math.pow(1 - subProgress, 3);
  const translateYSub = (1 - subEased) * 20;
  const opacitySub = 0.45 + subEased * 0.55;
  const clipSub = (1 - subEased) * 100;

  // 4. "SEE WHAT TIME HIDES." Word Stagger (0.34 -> 0.54)
  const words = ['SEE', 'WHAT', 'TIME', 'HIDES.'];
  const wordEaseds = words.map((_, idx) => {
    const start = 0.34 + idx * 0.025;
    const wordProg = Math.min(Math.max((progress - start) / 0.10, 0), 1);
    return 1 - Math.pow(1 - wordProg, 3);
  });

  // 5. Body Copy (0.46 -> 0.61)
  const bodyProgress = Math.min(Math.max((progress - 0.46) / 0.15, 0), 1);
  const bodyEased = 1 - Math.pow(1 - bodyProgress, 3);
  const translateYBody = (1 - bodyEased) * 22;
  const opacityBody = 0.55 + bodyEased * 0.45;
  const clipBody = (1 - bodyEased) * 100;

  // 6. Spec Metrics Sequential Reveal (0.56 -> 0.76)
  const specEaseds = specs.map((_, idx) => {
    const start = 0.56 + idx * 0.04;
    const specProg = Math.min(Math.max((progress - start) / 0.10, 0), 1);
    return 1 - Math.pow(1 - specProg, 3);
  });

  // 7. Bottom Telemetry Pills (0.70 -> 0.84)
  const pillsProgress = Math.min(Math.max((progress - 0.70) / 0.14, 0), 1);
  const pillsEased = 1 - Math.pow(1 - pillsProgress, 3);
  const translateXPills = (1 - pillsEased) * -12;
  const clipPills = (1 - pillsEased) * 100;

  // Reduced motion static fallback presentation
  if (prefersReducedMotion) {
    return (
      <section
        id="performance"
        className="section-stage"
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-canvas)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/action/performance-action.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(5, 6, 7, 0.96) 0%, rgba(5, 6, 7, 0.75) 45%, rgba(5, 6, 7, 0.25) 100%)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '640px' }}>
            <SectionLabel number="03" category="PERFORMANCE" />
            <div style={{ display: 'flex', flexDirection: 'column', margin: '16px 0 24px 0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                13X BURST SLOW-MOTION
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="display-giant" style={{ color: 'var(--gopro-blue)', textShadow: '0 0 30px var(--gopro-blue-glow)' }}>
                  400
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 3rem)', fontWeight: 700, color: 'var(--gopro-blue)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                  FPS
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '320px', lineHeight: 1.4 }}>
                Capture transient moments with extreme slow-motion clarity at 720p 400 FPS.
              </span>
            </div>
            <div style={{ marginTop: '24px', marginBottom: '32px' }}>
              <h3 className="headline-lg" style={{ marginBottom: '8px' }}>
                SEE WHAT TIME HIDES.
              </h3>
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Record high-velocity action in up to 13X burst slow motion, revealing split-second movements with razor-sharp definition.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                backgroundColor: 'rgba(11, 13, 15, 0.85)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-default)',
                padding: '16px',
                backdropFilter: 'blur(12px)',
              }}
            >
              {specs.map((spec) => (
                <div key={spec.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {spec.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '2px' }}>
                    {spec.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '40px' }}>
            <TelemetryLabel label="SENSOR" value='1/1.9" CMOS 8:7' active />
            <TelemetryLabel label="COLOR" value="10-BIT GP-LOG" />
            <TelemetryLabel label="BURST MODES" value="720P400 // 900P360 // 5.3K120" />
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Scroll-Driven Performance Experience
  return (
    <section id="performance" className="performance-sequence" style={{ position: 'relative', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Scroll Track with Sticky Stage */}
      <div ref={trackRef} className="performance-scroll-track" style={{ position: 'relative', width: '100%' }}>
        <div
          className="performance-sticky-stage"
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
          {/* Action Background Image with Dynamic Gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/action/performance-action.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              opacity: 0.9,
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(5, 6, 7, 0.96) 0%, rgba(5, 6, 7, 0.75) 45%, rgba(5, 6, 7, 0.25) 100%)',
              zIndex: 2,
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            <div style={{ maxWidth: '640px' }}>
              {/* 1. Section Label & Chapter Reveal */}
              <div
                style={{
                  clipPath: `inset(0 ${labelClip}% 0 0)`,
                  transform: `translateX(${labelTranslateX}px)`,
                  transition: 'clip-path 0.1s linear, transform 0.1s linear',
                }}
              >
                <SectionLabel number="03" category="PERFORMANCE" />
              </div>

              {/* 2. 400 FPS — High Speed Metric Display */}
              <div style={{ display: 'flex', flexDirection: 'column', margin: '16px 0 20px 0' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: `${labelTracking}em`,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '6px',
                    clipPath: `inset(0 ${labelClip}% 0 0)`,
                    transform: `translateX(${labelTranslateX}px)`,
                    transition: 'clip-path 0.1s linear, transform 0.1s linear',
                  }}
                >
                  13X BURST SLOW-MOTION
                </span>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  {/* 400 Main Number */}
                  <span
                    className="display-giant"
                    style={{
                      color: 'var(--gopro-blue)',
                      textShadow: '0 0 30px var(--gopro-blue-glow)',
                      transform: `translateY(${translateY400}px) scale(${scale400})`,
                      clipPath: `inset(${clip400}% 0 0 0)`,
                      transformOrigin: 'bottom left',
                      lineHeight: 0.9,
                      display: 'inline-block',
                      transition: 'transform 0.1s linear, clip-path 0.1s linear',
                    }}
                  >
                    400
                  </span>

                  {/* FPS Unit */}
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 3vw, 3rem)',
                      fontWeight: 700,
                      color: 'var(--gopro-blue)',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      transform: `translateX(${translateXFps}px)`,
                      clipPath: `inset(0 ${clipFps}% 0 0)`,
                      display: 'inline-block',
                      transition: 'transform 0.1s linear, clip-path 0.1s linear',
                    }}
                  >
                    FPS
                  </span>
                </div>

                {/* Supporting FPS copy */}
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginTop: '8px',
                    maxWidth: '340px',
                    lineHeight: 1.4,
                    opacity: opacitySub,
                    transform: `translateY(${translateYSub}px)`,
                    clipPath: `inset(${clipSub}% 0 0 0)`,
                    transition: 'opacity 0.1s linear, transform 0.1s linear, clip-path 0.1s linear',
                  }}
                >
                  Capture transient moments with extreme slow-motion clarity at 720p 400 FPS.
                </span>
              </div>

              {/* 3. "SEE WHAT TIME HIDES." Word-Stagger Headline */}
              <div style={{ marginTop: '20px', marginBottom: '28px' }}>
                <h3
                  className="headline-lg"
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.28em',
                  }}
                >
                  {words.map((word, idx) => (
                    <span
                      key={word}
                      style={{
                        display: 'inline-block',
                        transform: `translateY(${(1 - wordEaseds[idx]) * 45}px)`,
                        clipPath: `inset(${(1 - wordEaseds[idx]) * 100}% 0 0 0)`,
                        transition: 'transform 0.1s linear, clip-path 0.1s linear',
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </h3>

                <p
                  className="body-large"
                  style={{
                    color: 'var(--text-secondary)',
                    opacity: opacityBody,
                    transform: `translateY(${translateYBody}px)`,
                    clipPath: `inset(${clipBody}% 0 0 0)`,
                    transition: 'opacity 0.1s linear, transform 0.1s linear, clip-path 0.1s linear',
                  }}
                >
                  Record high-velocity action in up to 13X burst slow motion, revealing split-second movements with razor-sharp definition.
                </p>
              </div>

              {/* 4. Supporting Specs Strip — Sequential Left to Right */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  backgroundColor: 'rgba(11, 13, 15, 0.85)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-default)',
                  padding: '16px',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {specs.map((spec, idx) => (
                  <div
                    key={spec.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      transform: `translateY(${(1 - specEaseds[idx]) * 26}px)`,
                      opacity: 0.35 + specEaseds[idx] * 0.65,
                      transition: 'transform 0.1s linear, opacity 0.1s linear',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.08em',
                        marginTop: '2px',
                      }}
                    >
                      {spec.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Bottom Technical Telemetry */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '32px',
                transform: `translateX(${translateXPills}px)`,
                clipPath: `inset(0 ${clipPills}% 0 0)`,
                transition: 'transform 0.1s linear, clip-path 0.1s linear',
              }}
            >
              <TelemetryLabel label="SENSOR" value='1/1.9" CMOS 8:7' active />
              <TelemetryLabel label="COLOR" value="10-BIT GP-LOG" />
              <TelemetryLabel label="BURST MODES" value="720P400 // 900P360 // 5.3K120" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .performance-scroll-track {
          height: 180vh;
        }
        @media (max-width: 1024px) {
          .performance-scroll-track {
            height: 160vh;
          }
        }
        @media (max-width: 767px) {
          .performance-scroll-track {
            height: 140vh;
          }
        }
      `}</style>
    </section>
  );
};
