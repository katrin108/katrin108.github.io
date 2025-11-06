// node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 800;

const server = http.createServer((req, res) => {
  // Default to Triis.html if no specific file requested
  const filePath = path.join(__dirname, req.url === '/' ? 'Triis.html' : req.url);
  const ext = path.extname(filePath);

  // Pick correct MIME type based on file extension
  let contentType = 'text/html';
  if (ext === '.js') contentType = 'text/javascript';
  else if (ext === '.css') contentType = 'text/css';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});


server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/`);
});