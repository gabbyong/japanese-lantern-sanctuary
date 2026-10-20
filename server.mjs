import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadDotEnv() {
  const candidates = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env')
  ];
  const vars = {};
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (!vars[key]) vars[key] = val;
        }
      }
    }
  }
  return vars;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.cjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const PORT = Number(process.env.PORT || 8430);
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/api/env') {
    const envVars = loadDotEnv();
    const apiKey = process.env.GEMINI_API_KEY || envVars.GEMINI_API_KEY || '';
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end(
      JSON.stringify({
        apiKey,
        hasKey: Boolean(apiKey),
        model: 'models/lyria-realtime-exp'
      })
    );
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.join(__dirname, relativePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'public, max-age=300'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Floating Japanese Lantern Sanctuary running at http://127.0.0.1:${PORT}`);
});
