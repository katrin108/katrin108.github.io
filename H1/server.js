const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
http.createServer((req, res) => {
  let filePath = req.url === '/' ? 'gasket1.html' : '.' + req.url;
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
}).listen(port);

console.log(`Server running at http://localhost:${port}`);
