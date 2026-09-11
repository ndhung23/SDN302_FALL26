var http = require("http");
const fs = require('fs');
const { readFile } = require('./file');
const hostname = "localhost";
const port = 8082;

http.createServer(function (request, response) {
  // Send the HTTP header
  console.log(request.headers);
  // Send the response body of file
  if (request.method === 'GET') {
    let filename = ''; // Đổi const thành let

    if (request.url === '/' || request.url === '/index.html') {
      filename = 'index.html';
    } else if (request.url === '/about.html') {
      filename = 'about.html';
    }
    if (filename !== '') {
      readFile(filename)
        .then((data) => {
          response.setHeader('Content-Type', 'text/html');
          response.statusCode = 200;
          // response.end(data);
          fs.createReadStream(filename).pipe(response);
        })
        .catch((err) => {
          console.error('Error reading file:', err);
          response.statusCode = 500;
          response.end('Internal Server Error');
        });
    } else {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/html');
      response.end('<h1>Error 404: Not Found</h1>');
    }
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html');
    response.end(`<h1>Error 404: Method ${request.method} not supported</h1>`);
  }
}).listen(port);

// Console will print the message
console.log(`Server running at http://${hostname}:${port}/`);