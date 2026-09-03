import React, { useRef, useState, useEffect } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { TelemetryLabel } from '../ui/TelemetryLabel';
import { TechnicalDivider } from '../ui/TechnicalDivider';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const MountingSection: React.FC = () => {
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

  // Preload all 3 mounting assets
  useEffect(() => {
    const imagePaths = [
      '/assets/mounting/hero13-magnetic-latch.webp',
      '/assets/mounting/hero13-folding-fingers.webp',
      '/assets/mounting/hero13-quarter-thread.webp',
    ];
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);

  const mountProfiles = [
    {
      id: 'latch',
      label: '01 MAGNETIC LATCH',
      title: 'MAGNETIC LATCH MOUNT',
      desc: 'Quick-release magnetic engagement that snaps camera firmly onto mounts and allows instant swaps between setups.',
      spec: 'QUICK-RELEASE MAGNETIC LATCH // FAST CAMERA SWAP',
      image: '/assets/mounting/hero13-magnetic-latch.webp',
    },
    {
      id: 'fingers',
      label: '02 FOLDING FINGERS',
      title: 'BUILT-IN FOLDING FINGERS',
      desc: 'Built-in traditional dual fingers fold flat into the chassis and mount directly to the entire GoPro accessory ecosystem.',
      spec: 'INTEGRATED CHASSIS FINGERS // UNIVERSAL COMPATIBILITY',
      image: '/assets/mounting/hero13-folding-fingers.webp',
    },
    {
      id: 'threads',
      label: '03 1/4-20 THREADS',
      title: '1/4-20 MOUNTING THREADS',
      desc: 'Standard photographic 1/4-20 mounting thread centered on the bottom base for direct tripod and pro rig attachment without adapters.',
      spec: 'STANDARD 1/4-20 THREAD // TRIPOD & PRO RIG READY',
      image: '/assets/mounting/hero13-quarter-thread.webp',
    },
  ];

  // Normalized progress mapping:
  // 0.00 – 0.28: Magnetic Latch (active 0.08–0.28, exit 0.28–0.38)
  // 0.28 – 0.58: Folding Fingers (enter 0.28–0.38, active 0.38–0.58, exit 0.58–0.68)
  // 0.58 – 1.00: 1/4-20 Threads (enter 0.58–0.68, active 0.68–0.90, hold 0.90–1.00)
  const activeMountIndex = progress < 0.33 ? 0 : progress < 0.63 ? 1 : 2;
  const current = mountProfiles[activeMountIndex];

  // Mechanical transition wipes:
  // 1. Magnetic -> Folding (0.28 -> 0.38)
  const foldingWipe = Math.min(Math.max((progress - 0.28) / 0.10, 0), 1);
  // 2. Folding -> Thread (0.58 -> 0.68)
  const threadWipe = Math.min(Math.max((progress - 0.58) / 0.10, 0), 1);

  // Micro mechanical motions
  // Magnetic snap-in gap closing
  const magneticEntranceGap = Math.max(0, (0.08 - progress) / 0.08) * 30;

  // Folding fingers deployment float
  const foldingScale =
    progress < 0.28
      ? 1.03
      : progress < 0.58
      ? 1.03 - ((progress - 0.28) / 0.30) * 0.03
      : 1.00;
  const foldingTranslateY =
    progress < 0.28
      ? -12
      : progress < 0.58
      ? -12 + ((progress - 0.28) / 0.30) * 12
      : 0;

  // Thread stud alignment
  const threadScale =
    progress < 0.58
      ? 1.05
      : progress < 0.90
      ? 1.05 - ((progress - 0.58) / 0.32) * 0.05
      : 1.00;
  const threadStudOffset = Math.max(0, (0.75 - progress) / 0.17) * 20;

  // Copy opacities and translates
  const textOpacities = [
    progress < 0.26 ? 1 : Math.max(1 - (progress - 0.26) / 0.05, 0),
    progress < 0.32
      ? 0
      : progress < 0.38
      ? (progress - 0.32) / 0.06
      : progress < 0.56
      ? 1
      : Math.max(1 - (progress - 0.56) / 0.05, 0),
    progress < 0.62 ? 0 : progress < 0.68 ? (progress - 0.62) / 0.06 : 1,
  ];

  const textTranslates = [
    progress < 0.26 ? 0 : -(progress - 0.26) * 120,
    progress < 0.32
      ? 20
      : progress < 0.38
      ? (1 - (progress - 0.32) / 0.06) * 20
      : progress < 0.56
      ? 0
      : -(progress - 0.56) * 120,
    progress < 0.62 ? 20 : progress < 0.68 ? (1 - (progress - 0.62) / 0.06) * 20 : 0,
  ];

  // Click-to-scroll handler
  const scrollToMount = (index: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;

    const targets = [0.10, 0.43, 0.74];
    window.scrollTo({
      top: scrollTop + targets[index] * totalScrollable,
      behavior: 'smooth',
    });
  };

  // Reduced motion static fallback
  if (prefersReducedMotion) {
    return (
      <section id="mounting" className="section-stage bg-tactical-grid" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '32px' }}>
          <SectionLabel number="07" category="MOUNTING ECOSYSTEM" />
          <h2 className="headline-lg" style={{ marginBottom: '8px' }}>
            MOUNT. MOVE. REPEAT.
          </h2>
          <p className="body-large" style={{ maxWidth: '640px', marginBottom: '40px' }}>
            Three ways to lock in. HERO13 Black features the most versatile mounting ecosystem ever built into an action camera.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {mountProfiles.map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                }}
              >
                <img
                  src={m.image}
                  alt={m.title}
                  style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '16px' }}
                />
                <TelemetryLabel label="INTERFACE" value={m.title} active />
                <h3 className="headline-sm" style={{ marginTop: '12px', marginBottom: '4px' }}>
                  {m.title}
                </h3>
                <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Full Cinematic Sticky Mechanical Scroll Experience
  return (
    <section id="mounting" className="mounting-sequence bg-tactical-grid" style={{ backgroundColor: 'var(--bg-surface)', position: 'relative' }}>
      {/* 1. Natural Flow Intro Header */}
      <div className="mounting-intro container" style={{ paddingTop: '80px', paddingBottom: '32px', zIndex: 10 }}>
        <SectionLabel number="07" category="MOUNTING ECOSYSTEM" />
        <h2 className="headline-lg" style={{ marginTop: '8px', marginBottom: '8px' }}>
          MOUNT. MOVE. REPEAT.
        </h2>
        <p className="body-large" style={{ maxWidth: '640px', color: 'var(--text-secondary)' }}>
          Three ways to lock in. HERO13 Black features the most versatile mounting ecosystem ever built into an action camera.
        </p>
      </div>

      {/* 2. Scroll Track with Sticky Mechanical Stage */}
      <div ref={trackRef} className="mounting-scroll-track" style={{ position: 'relative', width: '100%' }}>
        <div
          className="mounting-sticky-stage"
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
            {/* Top Bar: Floating Mounting Selector Tabs */}
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
                {mountProfiles.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => scrollToMount(idx)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: activeMountIndex === idx ? '1px solid var(--gopro-blue)' : '1px solid transparent',
                      backgroundColor: activeMountIndex === idx ? 'var(--bg-raised)' : 'transparent',
                      color: activeMountIndex === idx ? 'var(--text-primary)' : 'var(--text-muted)',
                      boxShadow: activeMountIndex === idx ? '0 0 12px var(--gopro-blue-glow)' : 'none',
                      fontWeight: activeMountIndex === idx ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                ARCHITECTURE: {current.title} // {Math.round(progress * 100)}%
              </div>
            </div>

            {/* Split Staging Container */}
            <div
              className="mount-staging-box"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '24px',
                alignItems: 'center',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                minHeight: '460px',
                position: 'relative',
              }}
            >
              {/* Left Column: Dynamic Copy Stack */}
              <div style={{ gridColumn: 'span 12', position: 'relative', minHeight: '240px' }} className="mount-details-col">
                {mountProfiles.map((m, idx) => (
                  <div
                    key={m.id}
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
                      <TelemetryLabel label="INTERFACE" value={m.title} active />
                    </div>

                    <h3 className="headline-md" style={{ color: 'var(--text-primary)', marginTop: '8px', marginBottom: '8px' }}>
                      {m.title}
                    </h3>

                    <p className="body-base" style={{ maxWidth: '440px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
                      {m.desc}
                    </p>

                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.12em',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        maxWidth: '460px',
                      }}
                    >
                      {m.spec}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: 3 Distinct Layered Visual Assets with Mechanical Masking */}
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
                className="mount-visual-col"
              >
                {/* 1. MAGNETIC LATCH IMAGE (Base Layer with Gap Snap Motion) */}
                <img
                  src="/assets/mounting/hero13-magnetic-latch.webp"
                  alt="GoPro HERO13 with Magnetic Latch Mount"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    maxWidth: '620px',
                    maxHeight: '48vh',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
                    transform: `translateY(${magneticEntranceGap}px)`,
                    transformOrigin: 'center center',
                    zIndex: 1,
                  }}
                />

                {/* 2. FOLDING FINGERS IMAGE (Vertical Bottom-Up Mechanical Wipe) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    clipPath:
                      foldingWipe <= 0
                        ? 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
                        : foldingWipe >= 1
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        : `polygon(0 ${100 - foldingWipe * 100}%, 100% ${100 - foldingWipe * 100}%, 100% 100%, 0 100%)`,
                    zIndex: 2,
                  }}
                >
                  <img
                    src="/assets/mounting/hero13-folding-fingers.webp"
                    alt="GoPro HERO13 with Built-In Folding Fingers"
                    style={{
                      width: '100%',
                      maxWidth: '620px',
                      maxHeight: '48vh',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
                      transform: `scale(${foldingScale}) translateY(${foldingTranslateY}px)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>

                {/* 3. 1/4-20 THREADS IMAGE (Precision Lower-Angle Reveal with Stud Alignment) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    clipPath:
                      threadWipe <= 0
                        ? 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
                        : threadWipe >= 1
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        : `polygon(0 ${100 - threadWipe * 100}%, 100% ${100 - threadWipe * 100}%, 100% 100%, 0 100%)`,
                    zIndex: 3,
                  }}
                >
                  <img
                    src="/assets/mounting/hero13-quarter-thread.webp"
                    alt="GoPro HERO13 with 1/4-20 Mounting Threads"
                    style={{
                      width: '100%',
                      maxWidth: '620px',
                      maxHeight: '48vh',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      filter: 'drop-shadow(0 20px 50px rgba(0, 174, 239, 0.12)) drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
                      transform: `scale(${threadScale}) translateY(${threadStudOffset}px)`,
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
        <TechnicalDivider label="TRIPLE MOUNTING ARCHITECTURE // UNIVERSAL COMPATIBILITY" />
      </div>

      <style>{`
        .mounting-scroll-track {
          height: 340vh;
        }
        @media (max-width: 1024px) {
          .mounting-scroll-track {
            height: 280vh;
          }
        }
        @media (max-width: 767px) {
          .mounting-scroll-track {
            height: 230vh;
          }
        }

        @media (min-width: 992px) {
          .mount-details-col {
            grid-column: span 5 !important;
          }
          .mount-visual-col {
            grid-column: span 7 !important;
          }
        }
      `}</style>
    </section>
  );
};
