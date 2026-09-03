import { useState, useEffect, useRef, useCallback } from 'react';
import { getFrameUrl, FrameManifest } from '../utils/frameSequence';

interface UseFramePreloaderOptions {
  triggerRef?: React.RefObject<HTMLElement>;
}

export interface FramePreloaderState {
  loadedCount: number;
  totalCount: number;
  progressPercent: number;
  isInitialReady: boolean;
  isFullyLoaded: boolean;
  isMobileSet: boolean;
  getFrame: (index: number) => HTMLImageElement | null;
}

export function useFramePreloader({ triggerRef }: UseFramePreloaderOptions = {}): FramePreloaderState {
  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [isMobileSet, setIsMobileSet] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(96);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState<boolean>(false);

  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingStartedRef = useRef<boolean>(false);

  // 1. Fetch manifest & determine device frame set
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsMobileSet(isMobile);

    fetch('/assets/frames/engineering/manifest.json')
      .then((res) => res.json())
      .then((data: FrameManifest) => {
        setManifest(data);
        const count = isMobile ? data.mobile.count : data.desktop.count;
        setTotalCount(count);
      })
      .catch((err) => {
        console.warn('Could not load frame manifest, using fallback configuration', err);
        // Fallback default
        setTotalCount(isMobile ? 64 : 96);
      });
  }, []);

  // 2. Preload a single frame
  const loadSingleFrame = useCallback(
    (index: number, pattern: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (imagesRef.current.has(index)) {
          resolve(imagesRef.current.get(index)!);
          return;
        }

        const img = new Image();
        const url = getFrameUrl(pattern, index + 1); // 1-indexed filenames
        img.src = url;

        img.onload = () => {
          imagesRef.current.set(index, img);
          setLoadedCount((prev) => prev + 1);
          if (index === 0) setIsInitialReady(true);
          resolve(img);
        };

        img.onerror = () => {
          console.warn(`Failed to load frame ${index} from ${url}`);
          reject();
        };
      });
    },
    []
  );

  // 3. Early preload frame 0
  useEffect(() => {
    if (!manifest) return;
    const pattern = isMobileSet ? manifest.mobile.pattern : manifest.desktop.pattern;
    loadSingleFrame(0, pattern).catch(() => {});
  }, [manifest, isMobileSet, loadSingleFrame]);

  // 4. Batch preloading when section approaches viewport
  useEffect(() => {
    if (!manifest) return;

    const pattern = isMobileSet ? manifest.mobile.pattern : manifest.desktop.pattern;
    const count = isMobileSet ? manifest.mobile.count : manifest.desktop.count;

    const startFullPreload = () => {
      if (loadingStartedRef.current) return;
      loadingStartedRef.current = true;

      // Priority 1: Keyframes (First, Last, 25%, 50%, 75%)
      const keyframes = [
        0,
        count - 1,
        Math.round(count * 0.25),
        Math.round(count * 0.5),
        Math.round(count * 0.75),
      ];

      const keyframePromises = keyframes.map((k) => loadSingleFrame(k, pattern));

      // Priority 2: Remaining frames
      Promise.allSettled(keyframePromises).then(() => {
        const remaining: number[] = [];
        for (let i = 0; i < count; i++) {
          if (!keyframes.includes(i)) remaining.push(i);
        }

        // Load in progressive batches of 6
        let batchIndex = 0;
        const loadNextBatch = () => {
          if (batchIndex >= remaining.length) {
            setIsFullyLoaded(true);
            return;
          }
          const batch = remaining.slice(batchIndex, batchIndex + 6);
          batchIndex += 6;

          Promise.allSettled(batch.map((idx) => loadSingleFrame(idx, pattern))).then(() => {
            loadNextBatch();
          });
        };

        loadNextBatch();
      });
    };

    if (triggerRef?.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            startFullPreload();
            observer.disconnect();
          }
        },
        { rootMargin: '150% 0px' } // Start 1.5 screen heights before section
      );

      observer.observe(triggerRef.current);
      return () => observer.disconnect();
    } else {
      // Fallback: start preload shortly after mount
      const timer = setTimeout(startFullPreload, 800);
      return () => clearTimeout(timer);
    }
  }, [manifest, isMobileSet, triggerRef, loadSingleFrame]);

  // 5. Safe frame getter with closest loaded frame fallback to prevent white flash
  const getFrame = useCallback(
    (targetIndex: number): HTMLImageElement | null => {
      const map = imagesRef.current;
      if (map.has(targetIndex)) {
        return map.get(targetIndex)!;
      }

      if (map.size === 0) return null;

      // Find nearest loaded frame index
      let closest = -1;
      let minDiff = Infinity;
      for (const loadedIdx of map.keys()) {
        const diff = Math.abs(loadedIdx - targetIndex);
        if (diff < minDiff) {
          minDiff = diff;
          closest = loadedIdx;
        }
      }

      return closest !== -1 ? map.get(closest)! : null;
    },
    []
  );

  const progressPercent = totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0;

  return {
    loadedCount,
    totalCount,
    progressPercent,
    isInitialReady,
    isFullyLoaded,
    isMobileSet,
    getFrame,
  };
}
