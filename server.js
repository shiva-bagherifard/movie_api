const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = 8080;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Logging request URL and timestamp to log.txt file
  const logData = `${req.url} - ${new Date().toISOString()}\n`;
  fs.appendFile(path.join(__dirname, 'log.txt'), logData, (err) => {
    if (err) {
      console.error('Error logging request:', err);
    }
  });

  if (pathname.includes('documentation')) {
    const documentationPath = path.join(__dirname, 'documentation.html');
    fs.readFile(documentationPath, (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else {
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
