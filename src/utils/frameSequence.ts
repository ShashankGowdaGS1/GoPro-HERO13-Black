/**
 * Frame Sequence and Mapping Utilities for GoPro HERO13 Black Engineering Chapter
 */

export interface FrameManifest {
  source: {
    filename: string;
    duration: number;
    width: number;
    height: number;
    fps: number;
  };
  desktop: FrameSetInfo;
  mobile: FrameSetInfo;
}

export interface FrameSetInfo {
  count: number;
  width: number;
  height: number;
  fps: number;
  format: string;
  pattern: string;
  totalSizeMB: number;
  avgFrameKB: number;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Standard cubic ease-in-out curve for natural physical motion
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Maps normalized scroll progress (0.0 -> 1.0) to a source frame index (0 -> totalFrames - 1)
 *
 * Sequence choreography:
 * 0.00 - 0.12 (0% - 12%):   ASSEMBLED HOLD        -> Frame 0
 * 0.12 - 0.50 (12% - 50%):  DISASSEMBLY           -> Frame 0 -> Frame N - 1
 * 0.50 - 0.65 (50% - 65%):  EXPLODED HOLD         -> Frame N - 1
 * 0.65 - 0.92 (65% - 92%):  REASSEMBLY (Reverse)  -> Frame N - 1 -> Frame 0
 * 0.92 - 1.00 (92% - 100%): ASSEMBLED HOLD        -> Frame 0
 */
export function mapProgressToFrameIndex(progress: number, totalFrames: number): number {
  const p = clamp(progress, 0, 1);
  const maxIndex = Math.max(0, totalFrames - 1);

  if (p <= 0.12) {
    // 1. Assembled Hold
    return 0;
  } else if (p < 0.5) {
    // 2. Disassembly
    const localT = (p - 0.12) / (0.5 - 0.12);
    const easedT = easeInOutCubic(localT);
    return Math.round(easedT * maxIndex);
  } else if (p <= 0.65) {
    // 3. Exploded Hold
    return maxIndex;
  } else if (p < 0.92) {
    // 4. Reassembly (Exact reverse)
    const localT = (p - 0.65) / (0.92 - 0.65);
    const easedT = easeInOutCubic(localT);
    return Math.round((1 - easedT) * maxIndex);
  } else {
    // 5. Final Assembled Hold
    return 0;
  }
}

/**
 * Returns formatted frame path (e.g. /assets/frames/engineering/desktop/frame-0001.jpg)
 */
export function getFrameUrl(pattern: string, index1Based: number): string {
  const padded = String(index1Based).padStart(4, '0');
  return pattern.replace('{index}', padded);
}
