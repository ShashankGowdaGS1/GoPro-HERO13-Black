import React, { useRef, useState, useEffect } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { TelemetryLabel } from '../ui/TelemetryLabel';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const StabilizationSection: React.FC = () => {
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

  // 1. Chapter Label (0.10 -> 0.24)
  const labelProgress = Math.min(Math.max((progress - 0.10) / 0.14, 0), 1);
  const labelEased = 1 - Math.pow(1 - labelProgress, 3);
  const labelClip = (1 - labelEased) * 100;
  const labelTranslateX = (1 - labelEased) * -16;

  // 2. HYPERSMOOTH 6.0 Stabilizing Typography Entrance (0.18 -> 0.38)
  const headProgress = Math.min(Math.max((progress - 0.18) / 0.20, 0), 1);
  let headTranslateX = 0;
  let headRotate = 0;
  let headTranslateY = 0;

  if (headProgress < 0.5) {
    // Unstable entrance phase (-20px, -0.8deg, 12px -> +7px, +0.25deg, 4px)
    const t = headProgress / 0.5;
    const easedT = 1 - Math.pow(1 - t, 2);
    headTranslateX = -20 + easedT * 27; // -20 -> +7
    headRotate = -0.8 + easedT * 1.05; // -0.8 -> +0.25
    headTranslateY = 12 * (1 - easedT);
  } else {
    // Stabilization lock phase (+7px, +0.25deg -> 0px, 0deg)
    const t = (headProgress - 0.5) / 0.5;
    const easedT = 1 - Math.pow(1 - t, 3);
    headTranslateX = 7 * (1 - easedT);
    headRotate = 0.25 * (1 - easedT);
    headTranslateY = 0;
  }
  const headClip = (1 - Math.min(headProgress * 1.5, 1)) * 100;

  // 3. Supporting Sentence (0.30 -> 0.46)
  const subProgress = Math.min(Math.max((progress - 0.30) / 0.16, 0), 1);
  const subEased = 1 - Math.pow(1 - subProgress, 3);
  const subTranslateY = (1 - subEased) * 24;
  const subClip = (1 - subEased) * 100;
  const subOpacity = 0.50 + subEased * 0.50;

  // 4. Technical HUD Panel Border Drawing & Telemetry (0.40 -> 0.62)
  const panelProgress = Math.min(Math.max((progress - 0.40) / 0.22, 0), 1);
  const panelEased = 1 - Math.pow(1 - panelProgress, 3);
  const telemetryClip = (1 - panelEased) * 100;

  // 5. Two Feature Columns (0.54 -> 0.72)
  // Left Column (Horizon Leveling): -24px -> 0
  const col1Progress = Math.min(Math.max((progress - 0.54) / 0.14, 0), 1);
  const col1Eased = 1 - Math.pow(1 - col1Progress, 3);
  const col1TranslateX = (1 - col1Eased) * -24;
  const col1Opacity = 0.40 + col1Eased * 0.60;

  // Right Column (360° Horizon Lock): +24px -> 0
  const col2Progress = Math.min(Math.max((progress - 0.58) / 0.14, 0), 1);
  const col2Eased = 1 - Math.pow(1 - col2Progress, 3);
  const col2TranslateX = (1 - col2Eased) * 24;
  const col2Opacity = 0.40 + col2Eased * 0.60;

  // 6. Lock Moment & Bottom Status (0.68 -> 0.82)
  const lockProgress = Math.min(Math.max((progress - 0.68) / 0.14, 0), 1);
  const isLocked = lockProgress >= 0.7;
  const lockBorderOpacity = lockProgress > 0 && lockProgress < 0.7 ? 0.55 + lockProgress * 0.64 : 0.72;

  const bottomProgress = Math.min(Math.max((progress - 0.68) / 0.14, 0), 1);
  const bottomEased = 1 - Math.pow(1 - bottomProgress, 3);
  const bottomTranslateX = (1 - bottomEased) * -12;
  const bottomClip = (1 - bottomEased) * 100;

  // Reduced motion static fallback presentation
  if (prefersReducedMotion) {
    return (
      <section
        id="stabilization"
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
            backgroundImage: 'url(/assets/action/stabilization-action.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(5,6,7,0.88) 0%, rgba(5,6,7,0.45) 50%, rgba(5,6,7,0.92) 100%)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '600px', marginBottom: '32px' }}>
            <SectionLabel number="05" category="IN-CAMERA STABILIZATION" />
            <h2 className="headline-lg" style={{ marginBottom: '8px' }}>
              HYPERSMOOTH 6.0
            </h2>
            <p className="body-large">
              Stay steady when nothing else is. Emmy Award-winning in-camera stabilization automatically calculates optimal cropping based on your velocity and motion.
            </p>
          </div>

          <div
            style={{
              position: 'relative',
              maxWidth: '800px',
              border: '1px solid var(--gopro-blue)',
              borderRadius: 'var(--radius-default)',
              padding: '24px',
              backgroundColor: 'rgba(11, 13, 15, 0.75)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px var(--gopro-blue-glow)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <TelemetryLabel label="ALGORITHM" value="HYPERSMOOTH 6.0 AUTOBOOST" active />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                GYRO SAMPLE RATE: 1000HZ
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Horizon Leveling
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Keeps your horizon dead-level and smooth even if your camera tilts up to 27° during aggressive singletrack action.
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--gopro-blue)', marginBottom: '4px' }}>
                  360° Horizon Lock
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Achieve full 360-degree rotation lock without horizon shift when paired with the HB-Series Ultra Wide Lens Mod.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
            <TelemetryLabel label="AUTOBOOST" value="REAL-TIME MARGIN SCALING" />
            <TelemetryLabel label="HORIZON LOCK" value="360° WITH ULTRA WIDE MOD" />
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Scroll-Driven Stabilization Experience
  return (
    <section id="stabilization" className="stabilization-sequence" style={{ position: 'relative', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Scroll Track with Sticky Stage */}
      <div ref={trackRef} className="stabilization-scroll-track" style={{ position: 'relative', width: '100%' }}>
        <div
          className="stabilization-sticky-stage"
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
          {/* Action Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/action/stabilization-action.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.9,
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(5,6,7,0.88) 0%, rgba(5,6,7,0.45) 50%, rgba(5,6,7,0.92) 100%)',
              zIndex: 2,
            }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            <div style={{ maxWidth: '600px', marginBottom: '28px' }}>
              {/* 1. Chapter Label */}
              <div
                style={{
                  clipPath: `inset(0 ${labelClip}% 0 0)`,
                  transform: `translateX(${labelTranslateX}px)`,
                  transition: 'clip-path 0.1s linear, transform 0.1s linear',
                }}
              >
                <SectionLabel number="05" category="IN-CAMERA STABILIZATION" />
              </div>

              {/* 2. HYPERSMOOTH 6.0 Stabilizing Motion */}
              <h2
                className="headline-lg"
                style={{
                  marginTop: '8px',
                  marginBottom: '8px',
                  display: 'inline-block',
                  transform: `translate(${headTranslateX}px, ${headTranslateY}px) rotate(${headRotate}deg)`,
                  clipPath: `inset(${headClip}% 0 0 0)`,
                  transformOrigin: 'center left',
                  transition: 'transform 0.1s linear, clip-path 0.1s linear',
                }}
              >
                HYPERSMOOTH 6.0
              </h2>

              {/* 3. Supporting Description */}
              <p
                className="body-large"
                style={{
                  opacity: subOpacity,
                  transform: `translateY(${subTranslateY}px)`,
                  clipPath: `inset(${subClip}% 0 0 0)`,
                  transition: 'opacity 0.1s linear, transform 0.1s linear, clip-path 0.1s linear',
                }}
              >
                Stay steady when nothing else is. Emmy Award-winning in-camera stabilization automatically calculates optimal cropping based on your velocity and motion.
              </p>
            </div>

            {/* 4. HUD Frame Overlay Box with Sequential Border Draw */}
            <div
              style={{
                position: 'relative',
                maxWidth: '800px',
                border: `1px solid rgba(0, 174, 239, ${lockBorderOpacity})`,
                borderRadius: 'var(--radius-default)',
                padding: '24px',
                backgroundColor: 'rgba(11, 13, 15, 0.75)',
                backdropFilter: 'blur(12px)',
                boxShadow: isLocked ? '0 0 35px rgba(0, 174, 239, 0.28)' : '0 0 15px rgba(0, 174, 239, 0.10)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Inner HUD Telemetry Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px',
                  clipPath: `inset(0 ${telemetryClip}% 0 0)`,
                  transition: 'clip-path 0.1s linear',
                }}
              >
                <TelemetryLabel label="ALGORITHM" value="HYPERSMOOTH 6.0 AUTOBOOST" active />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                  GYRO SAMPLE RATE: 1000HZ
                </div>
              </div>

              {/* 5. Two Converging Feature Columns */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Column 1 — Horizon Leveling (from left) */}
                <div
                  style={{
                    transform: `translateX(${col1TranslateX}px)`,
                    opacity: col1Opacity,
                    transition: 'transform 0.1s linear, opacity 0.1s linear',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Horizon Leveling
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Keeps your horizon dead-level and smooth even if your camera tilts up to 27° during aggressive singletrack action.
                  </div>
                </div>

                {/* Column 2 — 360° Horizon Lock (from right) */}
                <div
                  style={{
                    transform: `translateX(${col2TranslateX}px)`,
                    opacity: col2Opacity,
                    transition: 'transform 0.1s linear, opacity 0.1s linear',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--gopro-blue)', marginBottom: '4px' }}>
                    360° Horizon Lock
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Achieve full 360-degree rotation lock without horizon shift when paired with the HB-Series Ultra Wide Lens Mod.
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Bottom Status Pills */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '24px',
                transform: `translateX(${bottomTranslateX}px)`,
                clipPath: `inset(0 ${bottomClip}% 0 0)`,
                transition: 'transform 0.1s linear, clip-path 0.1s linear',
              }}
            >
              <TelemetryLabel label="AUTOBOOST" value="REAL-TIME MARGIN SCALING" />
              <TelemetryLabel label="HORIZON LOCK" value="360° WITH ULTRA WIDE MOD" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stabilization-scroll-track {
          height: 180vh;
        }
        @media (max-width: 1024px) {
          .stabilization-scroll-track {
            height: 160vh;
          }
        }
        @media (max-width: 767px) {
          .stabilization-scroll-track {
            height: 140vh;
          }
        }
      `}</style>
    </section>
  );
};
