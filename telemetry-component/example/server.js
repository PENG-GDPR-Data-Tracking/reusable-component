'use strict';

const tracer = require('./tracer')('example-http-server');
// eslint-disable-next-line import/order
const http = require('http');

/** Starts a HTTP server that receives requests on sample server port. */
function startServer(port) {
  // Creates a server
  const server = http.createServer(handleRequest);
  // Starts the server
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Node HTTP listening on ${port}`);
  });
}

/** A function which handles requests and send response. */
function handleRequest(request, response) {
  try {
    const body = [];
    request.on('error', (err) => console.log(err));
    request.on('data', (chunk) => body.push(chunk));
    request.on('end', () => {
      http.get("http://localhost:8888", {
        headers: {
          "GDPR": "Because, why not?"
        }
      }, (res) => {
        console.log(res.body)
        response.end('Hello World!');
      })
    });
  } catch (err) {
    console.error(err);
  }
}

startServer(8080);
