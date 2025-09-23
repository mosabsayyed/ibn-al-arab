#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DIST_DIR = path.join(__dirname, '..', 'dist', 'spa');
const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1';
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || '4101', 10);
const PORT = parseInt(process.env.PORT || '3000', 10);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function serveFile(filePath, res) {
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      // Fallback to index.html for SPA routes
      const index = path.join(DIST_DIR, 'index.html');
      fs.readFile(index, (ie, data) => {
        if (ie) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('index.html not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const ct = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      res.writeHead(500);
      res.end('File read error');
    });
  });
}

function proxyToBackend(req, res) {
  const parsed = url.parse(req.url);
  const options = {
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    path: parsed.path,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: ' + String(err));
  });

  // Pipe request body
  req.pipe(proxyReq, { end: true });
}

const server = http.createServer((req, res) => {
  try {
    const parsed = url.parse(req.url);
    // Proxy API requests
    if (parsed.pathname && parsed.pathname.startsWith('/api')) {
      proxyToBackend(req, res);
      return;
    }

    // Serve static files from DIST_DIR
    let safePath = decodeURIComponent(parsed.pathname || '/');
    if (safePath.includes('..')) safePath = '/';
    let filePath = path.join(DIST_DIR, safePath);

    // If path is directory, serve index.html
    if (safePath === '/' || safePath.endsWith('/')) {
      filePath = path.join(DIST_DIR, 'index.html');
      serveFile(filePath, res);
      return;
    }

    serveFile(filePath, res);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Serving ${DIST_DIR} on http://localhost:${PORT} (proxy /api -> http://${BACKEND_HOST}:${BACKEND_PORT})`);
});
