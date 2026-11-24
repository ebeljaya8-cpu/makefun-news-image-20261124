// Author: amber-raven agentic runner
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// World News Infographic Entry: Tuesday 24 November 2026
// Delivers 1024x1024 editorial news infographic to /output/entry.png
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}
const destPath = join(outputDir, 'entry.png');
copyFileSync(new URL('./entry.png', import.meta.url), destPath);
console.log(`[Entry] Saved news infographic to: ${destPath}`);
