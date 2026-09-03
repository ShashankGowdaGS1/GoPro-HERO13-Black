import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const videoPath = path.join(rootDir, 'source-assets', 'video', 'hero13-engineering-master.mp4');
const outputBase = path.join(rootDir, 'public', 'assets', 'frames', 'engineering');
const desktopDir = path.join(outputBase, 'desktop');
const mobileDir = path.join(outputBase, 'mobile');
const manifestPath = path.join(outputBase, 'manifest.json');

console.log('====================================================');
console.log('GoPro HERO13 Black — Engineering Frame Extraction');
console.log('====================================================\n');

if (!fs.existsSync(videoPath)) {
  console.error(`Error: Source video not found at ${videoPath}`);
  process.exit(1);
}

// 1. Probe video metadata
console.log('1. Probing source video...');
let probeData;
try {
  const probeOutput = execSync(
    `ffprobe -v quiet -print_format json -show_streams -show_format "${videoPath}"`,
    { encoding: 'utf-8' }
  );
  probeData = JSON.parse(probeOutput);
} catch (err) {
  console.error('Error executing ffprobe:', err.message);
  process.exit(1);
}

const videoStream = probeData.streams.find((s) => s.codec_type === 'video');
const duration = parseFloat(probeData.format.duration || videoStream.duration);
const sourceWidth = videoStream.width;
const sourceHeight = videoStream.height;
const sourceFps = eval(videoStream.r_frame_rate || '24');

console.log(`- Duration: ${duration.toFixed(2)}s`);
console.log(`- Dimensions: ${sourceWidth}x${sourceHeight}`);
console.log(`- Native FPS: ${sourceFps}`);
console.log(`- Total Source Frames: ${videoStream.nb_frames || Math.round(duration * sourceFps)}\n`);

// 2. Clean & prepare output directories
console.log('2. Preparing output directories...');
fs.rmSync(desktopDir, { recursive: true, force: true });
fs.rmSync(mobileDir, { recursive: true, force: true });
fs.mkdirSync(desktopDir, { recursive: true });
fs.mkdirSync(mobileDir, { recursive: true });

// 3. Extract Desktop Frames (Target: 12 fps -> 96 frames @ 1600x900)
console.log('3. Extracting Desktop frames (12 fps, 1600x900, JPEG q:v 2)...');
const desktopStartTime = Date.now();
execSync(
  `ffmpeg -y -i "${videoPath}" -vf "fps=12,scale=1600:-2" -q:v 2 "${path.join(desktopDir, 'frame-%04d.jpg')}"`,
  { stdio: 'inherit' }
);
const desktopDuration = ((Date.now() - desktopStartTime) / 1000).toFixed(2);
const desktopFiles = fs.readdirSync(desktopDir).filter((f) => f.endsWith('.jpg')).sort();
const desktopTotalBytes = desktopFiles.reduce((acc, f) => acc + fs.statSync(path.join(desktopDir, f)).size, 0);

console.log(`✓ Desktop extraction finished in ${desktopDuration}s:`);
console.log(`  - Frame Count: ${desktopFiles.length}`);
console.log(`  - Total Size: ${(desktopTotalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`  - Avg Frame Size: ${(desktopTotalBytes / desktopFiles.length / 1024).toFixed(1)} KB\n`);

// 4. Extract Mobile Frames (Target: 8 fps -> 64 frames @ 960x540)
console.log('4. Extracting Mobile frames (8 fps, 960x540, JPEG q:v 3)...');
const mobileStartTime = Date.now();
execSync(
  `ffmpeg -y -i "${videoPath}" -vf "fps=8,scale=960:-2" -q:v 3 "${path.join(mobileDir, 'frame-%04d.jpg')}"`,
  { stdio: 'inherit' }
);
const mobileDuration = ((Date.now() - mobileStartTime) / 1000).toFixed(2);
const mobileFiles = fs.readdirSync(mobileDir).filter((f) => f.endsWith('.jpg')).sort();
const mobileTotalBytes = mobileFiles.reduce((acc, f) => acc + fs.statSync(path.join(mobileDir, f)).size, 0);

console.log(`✓ Mobile extraction finished in ${mobileDuration}s:`);
console.log(`  - Frame Count: ${mobileFiles.length}`);
console.log(`  - Total Size: ${(mobileTotalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`  - Avg Frame Size: ${(mobileTotalBytes / mobileFiles.length / 1024).toFixed(1)} KB\n`);

// 5. Generate Manifest
console.log('5. Generating manifest.json...');
const manifest = {
  source: {
    filename: path.basename(videoPath),
    duration: duration,
    width: sourceWidth,
    height: sourceHeight,
    fps: sourceFps,
  },
  desktop: {
    count: desktopFiles.length,
    width: 1600,
    height: 900,
    fps: 12,
    format: 'jpg',
    pattern: '/assets/frames/engineering/desktop/frame-{index}.jpg',
    totalSizeMB: parseFloat((desktopTotalBytes / (1024 * 1024)).toFixed(2)),
    avgFrameKB: parseFloat((desktopTotalBytes / desktopFiles.length / 1024).toFixed(1)),
  },
  mobile: {
    count: mobileFiles.length,
    width: 960,
    height: 540,
    fps: 8,
    format: 'jpg',
    pattern: '/assets/frames/engineering/mobile/frame-{index}.jpg',
    totalSizeMB: parseFloat((mobileTotalBytes / (1024 * 1024)).toFixed(2)),
    avgFrameKB: parseFloat((mobileTotalBytes / mobileFiles.length / 1024).toFixed(1)),
  },
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`✓ Manifest written to ${manifestPath}`);
console.log('\nFrame extraction pipeline successfully completed!');
