const http = require('http');
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('web-client'))
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
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        // console.log(body.toString());
        res.status(200).send('Hello World!');
      });
    }
  ));

app.listen(port, () => console.log(`Client listening at http://localhost:${port}`))
