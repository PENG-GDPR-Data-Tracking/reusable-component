import express from 'express';
import cors from 'cors';

const server = {
  name: "server-1-justexpress",
  port: 8001
};

const app = express();
app.use(cors());
app.get('*', (req, res) => res.send(`That's it from ${server.name}.`));
app.listen(server.port, () => console.log(`http://localhost:${server.port}: ${server.name} started.`));
