import { Server } from '../types';

import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';

export const registerServer = (server: Server) => {
  // console.log(`Registering server ${server.name}`);

  const app = express();
  const staticPath = path.resolve(__dirname, `${server.name}/web`);
  // console.log('staticPath', staticPath)
  app.use(cors());
  app.use(express.static(staticPath));

  server.paths.forEach((path) => {
    app.get(path, (req, res) => {
      // respond to the client
      res.send(`Response to path ${path} from ${server.name}`);

      // pass the request
      server.remoteUrls.forEach((url) => http.get(url));
    });
  });

  app.get('*', (req, res) => res.send(`That's it from ${server.name}.`));
  app.listen(server.port, '0.0.0.0', () => console.log(`http://localhost:${server.port}: ${server.name} started.`));
};
