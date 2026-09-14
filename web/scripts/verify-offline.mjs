import { promises as fs } from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.argv[2] ?? "dist");
const indexPath = path.join(distDir, "index.html");
const html = await fs.readFile(indexPath, "utf8");

const remoteAssetPatterns = [
  /<(?:script|img)[^>]+src=["']https?:\/\//i,
  /<link[^>]+(?:rel=["'](?:stylesheet|preload|modulepreload|icon|manifest)["'])[^>]+href=["']https?:\/\//i,
  /url\(["']?https?:\/\//i,
];

if (remoteAssetPatterns.some((pattern) => pattern.test(html))) {
  console.error("Local verification failed: index.html contains an externally loaded startup asset.");
  process.exit(1);
}

try {
  await fs.access(path.join(distDir, "sw.js"));
  console.error("Local verification failed: stale dist/sw.js exists. Delete dist and rebuild.");
  process.exit(1);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

console.log("Local verification passed: startup assets are local and no service worker is bundled.");
