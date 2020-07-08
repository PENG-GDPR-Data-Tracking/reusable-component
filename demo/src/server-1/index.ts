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
import http from 'http';
import { readFileSync } from 'fs';
const app = express();
const port = SERVICE_PORT;

// define a route handler for the default home page
app.get("/", (req, res) => {
  console.log('server1 got request', req)
  res.send(`Hello world from ${SERVICE_NAME}`);
});

app.get("/swagger/openapi.json", (req, res) => {
  res.send(readFileSync(path.resolve(__dirname + '/openapi.json'), "utf-8"))
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
    response => {
      // console.log('web-server:', 'server1 responded with', response)
      const body = [];
      response.on('data', chunk => body.push(chunk));
      response.on('end', () => {
        console.log(`response that ${SERVICE_NAME} got:`, body.toString());
        res.status(200).send(body.toString());
      });
    });
});

// start the Express server
app.listen(port, () => {
  console.log(`${SERVICE_NAME} started at http://localhost:${port}`);
});