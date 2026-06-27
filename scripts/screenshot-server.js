const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { name, data } = JSON.parse(body);
      const base64 = data.replace(/^data:image\/\w+;base64,/, '');
      const file = path.join(OUT_DIR, name);
      fs.writeFileSync(file, Buffer.from(base64, 'base64'));
      console.log('Saved:', file);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, file }));
    } catch (e) {
      res.writeHead(500);
      res.end(e.message);
    }
  });
});

server.listen(3001, () => console.log('Screenshot server: http://localhost:3001'));
