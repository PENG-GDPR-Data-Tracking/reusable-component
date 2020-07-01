'use strict';

const tracer = require('./tracer')({
  serviceName: 'client',
  baseTTL: 0,
  location: 'User Location',
});
// eslint-disable-next-line import/order
const http = require('http');

/** A function which makes requests and handles response. */
function makeRequest() {
  http.get(
    {
      host: 'localhost',
      port: 8080,
      path: '/helloworld',
    },
    (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        console.log(body.toString());
      });
    }
  );

  // The process must live for at least the interval past any traces that
  // must be exported, or some risk being lost if they are recorded after the
  // last export.
  console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
  setTimeout(() => {
    console.log('Completed.');
  }, 5000);
}

makeRequest();
