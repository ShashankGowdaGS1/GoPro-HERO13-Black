import React, { useState, useEffect, useRef, useCallback } from 'react';

interface HeroFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILMS = [
  {
    id: '360-showcase',
    title: 'STUDIO 360 SHOWCASE',
    src: '/assets/video/hero13-360-showcase.mp4',
    poster: '/assets/video/posters/poster-video-01.jpg',
    duration: 8.0,
  },
  {
    id: 'action-montage',
    title: 'ACTION & MOUNTING MONTAGE',
    src: '/assets/video/hero13-action-montage.mp4',
    poster: '/assets/video/posters/poster-video-02.jpg',
    duration: 10.0,
  },
];

export const HeroFilmModal: React.FC<HeroFilmModalProps> = ({ isOpen, onClose }) => {
  const [currentFilmIndex, setCurrentFilmIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeDuration, setActiveDuration] = useState<number>(FILMS[0].duration);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close handler with state reset
  const handleClose = useCallback(() => {
    if (video1Ref.current) {
      video1Ref.current.pause();
      video1Ref.current.currentTime = 0;
    }
    if (video2Ref.current) {
      video2Ref.current.pause();
      video2Ref.current.currentTime = 0;
    }
    setIsCompleted(false);
    setCurrentFilmIndex(0);
    setCurrentTime(0);
    onClose();
  }, [onClose]);

  // Keyboard Escape listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Playback initialization when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentFilmIndex(0);
      setIsCompleted(false);
      const v1 = video1Ref.current;
      if (v1) {
        v1.currentTime = 0;
        v1.muted = isMuted;
        v1.play().catch((err) => {
          console.warn('Autoplay with audio blocked, attempting muted playback', err);
          v1.muted = true;
          setIsMuted(true);
          v1.play().catch(() => {});
        });
      }
    }
  }, [isOpen, isMuted]);

  // Handle Video 01 ending -> immediate cut to Video 02
  const handleVideo1Ended = () => {
    setCurrentFilmIndex(1);
    const v2 = video2Ref.current;
    if (v2) {
      v2.currentTime = 0;
      v2.muted = isMuted;
      v2.play().catch(() => {});
    }
  };

  // Handle Video 02 ending -> film completion hold & replay UI
  const handleVideo2Ended = () => {
    setIsCompleted(true);
  };

  // Replay from beginning
  const handleReplay = () => {
    setIsCompleted(false);
    setCurrentFilmIndex(0);
    const v1 = video1Ref.current;
    if (v1) {
      v1.currentTime = 0;
      v1.play().catch(() => {});
    }
  };

  // Sound toggle
  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (video1Ref.current) video1Ref.current.muted = newMuted;
    if (video2Ref.current) video2Ref.current.muted = newMuted;
  };

  if (!isOpen) return null;

  const currentFilm = FILMS[currentFilmIndex];
  const progressPercent = activeDuration > 0 ? (currentTime / activeDuration) * 100 : 0;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="GoPro HERO13 Black Cinematic Film"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeInModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Video Container (16:9 contain) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Video 01: 360 Showcase */}
        <video
          ref={video1Ref}
          src={FILMS[0].src}
          poster={FILMS[0].poster}
          playsInline
          preload="auto"
          onTimeUpdate={() => {
            if (currentFilmIndex === 0 && video1Ref.current) {
              setCurrentTime(video1Ref.current.currentTime);
              setActiveDuration(video1Ref.current.duration || FILMS[0].duration);
            }
          }}
          onEnded={handleVideo1Ended}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: currentFilmIndex === 0 ? 1 : 0,
            pointerEvents: currentFilmIndex === 0 ? 'auto' : 'none',
            transition: 'opacity 0.05s linear',
          }}
        />

        {/* Video 02: Action Montage */}
        <video
          ref={video2Ref}
          src={FILMS[1].src}
          poster={FILMS[1].poster}
          playsInline
          preload={isOpen ? 'auto' : 'none'}
          onTimeUpdate={() => {
            if (currentFilmIndex === 1 && video2Ref.current) {
              setCurrentTime(video2Ref.current.currentTime);
              setActiveDuration(video2Ref.current.duration || FILMS[1].duration);
            }
          }}
          onEnded={handleVideo2Ended}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: currentFilmIndex === 1 ? 1 : 0,
            pointerEvents: currentFilmIndex === 1 ? 'auto' : 'none',
            transition: 'opacity 0.05s linear',
          }}
        />

        {/* Replay / Complete Overlay */}
        {isCompleted && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 6, 7, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              zIndex: 30,
              animation: 'fadeInModal 0.3s ease forwards',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--gopro-blue)', letterSpacing: '0.15em' }}>
              HERO13 BLACK // FILM COMPLETE
            </div>
            <h2 className="display-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
              GO WHERE THE STORY IS.
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={handleReplay}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-default)',
                  backgroundColor: 'var(--gopro-blue)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                  replay
                </span>
                [ REPLAY FILM ]
              </button>
              <button
                onClick={handleClose}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-default)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  cursor: 'pointer',
                }}
              >
                [ CLOSE VIEWER ]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Header Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>
            HERO13 <span style={{ color: 'var(--gopro-blue)' }}>BLACK</span>
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.14em' }}>
            // CINEMATIC FILM
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-default)',
              color: '#fff',
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              backdropFilter: 'blur(8px)',
              minHeight: '44px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: 'var(--gopro-blue)' }}>
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span>{isMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close Film Viewer"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-default)',
              color: '#fff',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              backdropFilter: 'blur(8px)',
              minHeight: '44px',
            }}
          >
            <span>CLOSE</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
              close
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry & Progress Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 32px 20px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--gopro-blue)', letterSpacing: '0.14em' }}>
              FILM 0{currentFilmIndex + 1} / 02
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: '#fff' }}>
              {currentFilm.title}
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            {currentTime.toFixed(1)}s / {activeDuration.toFixed(1)}s
          </div>
        </div>

        {/* Thin Playback Progress Line */}
        <div
          style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--gopro-blue)',
              boxShadow: '0 0 8px var(--gopro-blue)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
