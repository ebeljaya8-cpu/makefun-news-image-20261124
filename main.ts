import { statSync, existsSync, mkdirSync, copyFileSync, openSync, readSync, closeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

/**
 * Editorial News Infographic Pipeline - 24 November 2026
 * Verifies payload integrity and deploys entry artifact to make.fun target path.
 */

const currentDir = dirname(fileURLToPath(import.meta.url));
const sourceImage = join(currentDir, 'entry.png');
const MAX_BYTE_SIZE = 1024 * 1024; // 1MB constraint
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function validatePngSignature(filePath: string): void {
  const fd = openSync(filePath, 'r');
  const buffer = Buffer.alloc(8);
  readSync(fd, buffer, 0, 8, 0);
  closeSync(fd);

  for (let i = 0; i < PNG_MAGIC.length; i++) {
    if (buffer[i] !== PNG_MAGIC[i]) {
      throw new Error(`[Pipeline Error] File header mismatch: byte at offset ${i} is 0x${buffer[i].toString(16)} (expected 0x${PNG_MAGIC[i].toString(16)})`);
    }
  }
  console.log('[Pipeline] PNG magic signature verified (89 50 4E 47 0D 0A 1A 0A)');
}

function printElapsedTime(startTimeMs: number): void {
  const elapsed = (performance.now() - startTimeMs).toFixed(2);
  console.log(`[Pipeline] Pipeline finished successfully in ${elapsed} ms`);
}

function executePipeline(): void {
  const startTime = performance.now();
  console.log('[Pipeline] Initiating 24-Nov-2026 editorial news dispatch...');

  if (!existsSync(sourceImage)) {
    throw new Error(`[Pipeline Error] Missing entry image artifact at ${sourceImage}`);
  }

  const fileStats = statSync(sourceImage);
  console.log(`[Pipeline] Source image located (${fileStats.size.toLocaleString()} bytes)`);

  if (fileStats.size > MAX_BYTE_SIZE) {
    throw new Error(
      `[Pipeline Error] Image exceeds maximum payload limit: ${fileStats.size} > ${MAX_BYTE_SIZE} bytes`
    );
  }

  validatePngSignature(sourceImage);

  const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  if (!existsSync(destinationDir)) {
    console.log(`[Pipeline] Creating output directory: ${destinationDir}`);
    mkdirSync(destinationDir, { recursive: true });
  }

  const targetFile = join(destinationDir, 'entry.png');
  copyFileSync(sourceImage, targetFile);
  console.log(`[Pipeline] Successfully deployed infographic to ${targetFile}`);
  printElapsedTime(startTime);
}

try {
  executePipeline();
} catch (error) {
  console.error('[Pipeline Fatal]', error instanceof Error ? error.message : error);
  process.exit(1);
}
