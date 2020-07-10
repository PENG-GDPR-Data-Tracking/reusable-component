import { tracing } from "../../opentelemerty";

const CONFIG = {
  name: 'server-5-health-database',
  port: 8005,
  paths: ['/api1'],
  remoteUrls: ['http://localhost:8004/api2', 'http://localhost:8006/api2'],
  location: 'Europe',
  gdprTracingBaseConfiguration: {
    baseTTL: 0,
    baseLegalBasis: 'Contractual',
    baseLegitimateInterest: '',
    baseAutomatedDecisionMaking: false,
    basePurpose: 'Storing body health data',
  }
};

// don't know why, but opentelemetry express plugin works better when express is not yet imported
// so we initalize tracking and then register the server (run express) using dynamic import 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

tracing(CONFIG);
import('../registerServer').then(m => m.registerServer(CONFIG));
