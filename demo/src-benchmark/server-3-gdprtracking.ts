import { tracing } from '../src/opentelemerty'
const CONFIG = {
  name: 'server-3-gdprtracking',
  port: 8003,
  paths: [],
  remoteUrls: [],
  location: 'Europe',
  gdprTracingBaseConfiguration: {
    baseTTL: 0,
    baseLegalBasis: 'Contractual',
    baseLegitimateInterest: '',
    baseAutomatedDecisionMaking: false,
    basePurpose: 'Benchmarking',
  },
};
tracing(CONFIG);

import express from 'express';
import cors from 'cors';

const server = {
  name: CONFIG.name,
  port: CONFIG.port
};

const app = express();
app.use(cors());
app.get('*', (req, res) => res.send(`That's it from ${server.name}.`));
app.listen(server.port, () => console.log(`http://localhost:${server.port}: ${server.name} started.`));
