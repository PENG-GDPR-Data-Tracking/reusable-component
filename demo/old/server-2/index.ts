import { tracingNative } from '../../src/opentelemerty';
import * as path from 'path';

const SERVICE_NAME = 'server-2';
const SERVICE_PORT = 8081;
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
import { readFileSync } from 'fs';
var cors = require('cors');
const app = express();
const port = SERVICE_PORT;

app.use(cors());
// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send(`Hello world from ${SERVICE_NAME}`);
});

app.get('/swagger/openapi.json', (req, res) => {
  res.send(readFileSync(path.resolve(__dirname + '/openapi.json'), 'utf-8'));
});

app.get('*', (req, res) => {
  console.log('server2 got request', req.path);
  res.send(`Hello world from ${SERVICE_NAME}`);
});

// start the Express server
app.listen(port, () => {
  console.log(`${SERVICE_NAME} started at http://localhost:${port}`);
});
