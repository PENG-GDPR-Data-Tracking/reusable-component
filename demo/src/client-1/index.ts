const http = require('http');
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

import express from "express"
const app = express();
const port = SERVICE_PORT;

app.use(express.static('src/client-1'));
app.get('/api/profile/me', (req, res) =>

  // we forward the request from the express web-server to server1
  // node will respond to the request as soon as the response from the other server comes  
  http.get(
    {
      host: 'localhost',
      port: 8080,
      path: '/api/profile/me',
    },
    response => {
      // console.log('web-server:', 'server1 responded with', response)
      const body = [];
      response.on('data', chunk => body.push(chunk));
      response.on('end', () => {
        // console.log(body.toString());
        res.status(200).send('Hello World!');
      });
    }
  ));

app.listen(port, () => console.log(`Client listening at http://localhost:${port}`))
