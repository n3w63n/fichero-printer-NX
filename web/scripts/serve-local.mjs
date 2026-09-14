import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "dist");
const port = Number(process.env.PORT ?? 4174);

const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
  [".woff", "font/woff"],
  [".ico", "image/x-icon"],
]);

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^([/\\])+/, "");
  const candidate = path.join(root, normalized);
  return candidate.startsWith(root) ? candidate : null;
}

async function exists(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile();
  } catch {
    return false;
  }
}

try {
  await fs.access(path.join(root, "index.html"));
} catch {
  console.error(`No built app found in ${root}. Run: npm run build`);
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  try {
    let file = safePath(req.url ?? "/");
    if (!file) {
      res.writeHead(400, securityHeaders);
      res.end("Bad request");
      return;
    }

    if (req.url === "/" || !(await exists(file))) {
      file = path.join(root, "index.html");
    }

    const data = await fs.readFile(file);
    res.writeHead(200, {
      ...securityHeaders,
      "Content-Type": mime.get(path.extname(file).toLowerCase()) ?? "application/octet-stream",
    });
    res.end(data);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders });
    res.end("Local server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Fichero Local is available at http://localhost:${port}`);
  console.log("Bound to this computer only (127.0.0.1). No Internet connection is required.");
  console.log("Press Ctrl+C to stop.");
});
