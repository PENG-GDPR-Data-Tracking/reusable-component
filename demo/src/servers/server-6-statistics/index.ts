import { tracing } from "../../opentelemerty";

const CONFIG = {
  name: 'server-6-statistics',
  port: 8006,
  paths: ['/api1', '/api2'],
  remoteUrls: [],
  location: 'Europe',
  gdprTracingBaseConfiguration: {
    baseTTL: 0,
    baseLegalBasis: 'Contractual',
    baseLegitimateInterest: '',
    baseAutomatedDecisionMaking: false,
    basePurpose: 'Storing anonymous statistics data',
  }
};

// don't know why, but opentelemetry express plugin works better when express is not yet imported
// so we initalize tracking and then register the server (run express) using dynamic import 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

tracing(CONFIG);
import('../registerServer').then(m => m.registerServer(CONFIG));
