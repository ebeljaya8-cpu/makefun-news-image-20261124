import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// World News Infographic Generator - Tuesday 24 November 2026
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}
const destination = join(outputDir, 'entry.png');
copyFileSync(new URL('./entry.png', import.meta.url), destination);
console.log(`[makefun] Editorial news infographic written to ${destination}`);

