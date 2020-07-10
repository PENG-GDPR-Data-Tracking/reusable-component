import { tracing } from '../opentelemerty';
import { Server } from './types';

import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';

export const registerServer = (server: Server) => {
  console.log(`Registering server ${server.name}`);

  const app = express();
  const staticPath = path.resolve(__dirname, `${server.name}-static`);
  console.log('staticPath', staticPath)
  // app.use(express.static('src/client-1/web'), cors());

  server.paths.forEach(path => {
    app.get(path, (req, res) => {

      // respond to the client
      res.send(`Response to path ${path} from ${server.name}`);

      // pass the request
      server.remoteUrls.forEach(url => http.get(url));
    });
  })


}

