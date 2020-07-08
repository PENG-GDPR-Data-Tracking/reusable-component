import { tracing } from '../opentelemerty';
import * as path from 'path';

const SERVICE_NAME = 'server-1';
const SERVICE_PORT = 8080;
const SERVICE_GDPR_TRACING_CONFIG = {
  serviceName: SERVICE_NAME,
  location: 'Europe',
  baseTTL: 0,
  baseLegalBasis: 'Contractual',
  baseLegitimateInterest: '',
  baseAutomatedDecisionMaking: false,
  basePurpose: 'Service for providing our WebApp',
};

tracing(SERVICE_GDPR_TRACING_CONFIG);

import express from "express"
import { readFileSync } from 'fs';
const app = express();
const port = SERVICE_PORT;

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send(`Hello world from ${SERVICE_NAME}`);
});

app.get("/swagger/openapi.json", (req, res) => {
  res.send(readFileSync(path.resolve(__dirname + '/openapi.json'), "utf-8"))
});

// start the Express server
app.listen(port, () => {
  console.log(`${SERVICE_NAME} started at http://localhost:${port}`);
});