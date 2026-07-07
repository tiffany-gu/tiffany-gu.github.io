/**
 * Extract a scroll-scrub frame sequence from the generated hero film.
 *
 *   node scripts/extract-frames.mjs [input.mp4] [fps] [width]
 *
 * Defaults: assets_raw/hero.mp4, 15 fps, 1440px wide JPEGs
 * Output:   public/frames/frame_0001.jpg ...
 */
import { execFileSync } from "node:child_process";
import { readdirSync, rmSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.resolve(root, process.argv[2] ?? "assets_raw/hero.mp4");
const fps = Number(process.argv[3] ?? 15);
const width = Number(process.argv[4] ?? 1440);
const outDir = path.join(root, "public", "frames");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

execFileSync(
  ffmpeg,
  [
    "-i", input,
    "-vf", `fps=${fps},scale=${width}:-2:flags=lanczos`,
    "-q:v", "4",
    path.join(outDir, "frame_%04d.jpg"),
  ],
  { stdio: "inherit" }
);

const count = readdirSync(outDir).filter((f) => f.endsWith(".jpg")).length;
console.log(`\nExtracted ${count} frames to public/frames/`);
console.log(`Update FRAMES.count in src/data/content.js to ${count} if it differs.`);
