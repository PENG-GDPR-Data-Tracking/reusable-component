import { Server } from '../types';

import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';

export const registerServer = (server: Server) => {
  console.log(`Registering server ${server.name}`);

  const app = express();
  const staticPath = path.resolve(__dirname, `${server.name}/web`);
  console.log('staticPath', staticPath)
  app.use(express.static(staticPath), cors());

  server.paths.forEach(path => {
    app.get(path, (req, res) => {

      // respond to the client
      res.send(`Response to path ${path} from ${server.name}`);

      // pass the request
      server.remoteUrls.forEach(url => http.get(url));
    });
  })

  app.get('*', (req, res) => res.send(`That's it from ${server.name}.`));
  app.listen(server.port, () => console.log(`${server.name} started at http://localhost:${server.port}`));
}
