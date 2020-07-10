import { tracing } from '../opentelemerty';

const SERVICE_NAME = 'client-1';
const SERVICE_PORT = 3000;
const SERVICE_GDPR_TRACING_CONFIG = {
  serviceName: SERVICE_NAME,
  location: 'Europe',
  baseTTL: 0,
  baseLegalBasis: 'Contractual',
  baseLegitimateInterest: '',
  baseAutomatedDecisionMaking: false,
  basePurpose: 'Webserver for providing our WebApp',
};

tracing(SERVICE_GDPR_TRACING_CONFIG);

import express from 'express';
var cors = require('cors');
import http from 'http';
const app = express();
const port = SERVICE_PORT;

app.use(express.static('src/client-1/web'), cors());
app.get('*', (req, res) =>
  // we forward the request from the express web-server to server1
  // node will respond to the request as soon as the response from the other server comes
  http.get(
    {
      host: 'localhost',
      port: 8080,
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
  )
);

app.listen(port, () => console.log(`${SERVICE_NAME} started at http://localhost:${port}`));
