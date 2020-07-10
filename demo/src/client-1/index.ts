import { tracingNative } from '../opentelemerty';
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
tracingNative(SERVICE_GDPR_TRACING_CONFIG);

// don't know why, but opentelemetry express plugin works better when express is not yet imported
// so we initalize tracking and then import express

import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(express.static('src/client-1/web'), cors());
[
  { path: '/api/userData', remoteUrl: 'http://localhost:8000/api/' },
  { path: '/api/sleepData', remoteUrl: 'http://localhost:8001/api/' },
  { path: '/api/bodyHealthData', remoteUrl: 'http://localhost:8002/api/' },
].map(proxy => {
  app.get(proxy.path, (req, res) => {

    // respond to the client
    res.send(`Response to path ${proxy.path} from ${SERVICE_NAME}`);

    // pass the request
    http.get(proxy.remoteUrl);
  });
});

app.get('*', (req, res) => res.send(`That's it from ${SERVICE_NAME}.`));

app.listen(SERVICE_PORT, () => console.log(`${SERVICE_NAME} started at http://localhost:${SERVICE_PORT}`));
