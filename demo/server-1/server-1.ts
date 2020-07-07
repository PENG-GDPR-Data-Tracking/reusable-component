const tracer = require('../tracer')({
    serviceName: 'middleware',
    baseTTL: 0,
    location: 'Europe',
    baseLegalBasis: 'Contractual',
    baseLegitimateInterest: '',
    baseAutomatedDecisionMaking: false,
    basePurpose: 'Service for providing our WebApp',
  });
import express from "express"
import { readFileSync } from 'fs';
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get( "/swagger/openapi.json", ( req, res ) => {
    res.send(readFileSync("server-1/openapi.json", "utf-8"))
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );