import { tracingNative } from '../../src/opentelemerty';
const SERVICE_NAME = 'server-1-sleep-processing';
const SERVICE_PORT = 8001;
const SERVICE_GDPR_TRACING_CONFIG = {
  serviceName: SERVICE_NAME,
  location: 'Europe',
  baseTTL: 0,
  baseLegalBasis: 'Contractual',
  baseLegitimateInterest: '',
  baseAutomatedDecisionMaking: false,
  basePurpose: 'Service for providing our WebApp',
};
tracingNative(SERVICE_GDPR_TRACING_CONFIG);

import express from 'express';
import http from 'http';
var cors = require('cors');
import path from 'path';
import { readFileSync } from 'fs';
const app = express();
const port = SERVICE_PORT;

app.use(cors());

// define a route handler for the default home page
app.get('/', (req, res) => {
  console.log('server1 got request', req);
  res.send(`Hello world from ${SERVICE_NAME}`);
});

app.get('/swagger/openapi.json', (req, res) => {
  res.send(readFileSync(path.resolve(__dirname + '/openapi.json'), 'utf-8'));
});

app.get('/api/profile', (req, res) => {
  console.log('server1 got request "profile"', req.path);
  res.send(`Profile data from ${SERVICE_NAME}`);
});

app.get('*', (req, res) => {
  console.log('server1 got request "*"', req.path);
  http.get(
    {
      host: 'localhost',
      port: 8081,
      path: req.path,
    },
    (response) => {
      // console.log('web-server:', 'server1 responded with', response)
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        res.status(200).send(body.toString());
      });
    }
  );
});

// start the Express server
app.listen(port, () => {
  console.log(`${SERVICE_NAME} started at http://localhost:${port}`);
});
