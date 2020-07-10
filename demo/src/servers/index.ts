import { tracing } from "../opentelemerty";
import { registerServer } from "./registerServer";
import { Server } from "./types";

const SERVERS = [
  {
    name: 'server-1-users',
    port: 8001,
    paths: ['/api1'],
    remoteUrls: ['http://localhost:8004/api1', 'http://localhost:8006/api1'],
    location: 'Europe',
    gdprTracingBaseConfiguration: {
      baseTTL: 0,
      baseLegalBasis: 'Contractual',
      baseLegitimateInterest: '',
      baseAutomatedDecisionMaking: false,
      basePurpose: 'Providing user data (such as name, e-mail, password) for the WebApp',
    },
  },
  {
    name: 'server-2-sleep-preprocessing',
    port: 8002,
    paths: ['/api1'],
    remoteUrls: ['http://localhost:8004/api1'],
    location: 'Europe',
    gdprTracingBaseConfiguration: {
      baseTTL: 0,
      baseLegalBasis: 'Contractual',
      baseLegitimateInterest: '',
      baseAutomatedDecisionMaking: false,
      basePurpose: 'Preprocessing raw sleep data',
    },
  },
  {
    name: 'server-3-health-preprocessing',
    port: 8003,
    paths: ['/api1'],
    remoteUrls: ['http://localhost:8004/api1', 'http://localhost:8005/api1'],
    location: 'Europe',
    gdprTracingBaseConfiguration: {
      baseTTL: 0,
      baseLegalBasis: 'Contractual',
      baseLegitimateInterest: '',
      baseAutomatedDecisionMaking: false,
      basePurpose: 'Preprocessing raw body health data',
    }
  },
  {
    name: 'server-4-sleep-database',
    port: 8004,
    paths: ['/api1', '/api2'],
    remoteUrls: ['http://localhost:8005/api2'],
    location: 'Europe',
    gdprTracingBaseConfiguration: {
      baseTTL: 0,
      baseLegalBasis: 'Contractual',
      baseLegitimateInterest: '',
      baseAutomatedDecisionMaking: false,
      basePurpose: 'Storing sleep tracking data',
    }
  },
  {
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
  },
  {
    name: 'server-6-statistics',
    port: 8006,
    paths: ['/api1', '/api2'],
    remoteUrls: ['http://localhost:8005/api2'],
    location: 'Europe',
    gdprTracingBaseConfiguration: {
      baseTTL: 0,
      baseLegalBasis: 'Contractual',
      baseLegitimateInterest: '',
      baseAutomatedDecisionMaking: false,
      basePurpose: 'Storing anonymous statistics data',
    }
  }
];

SERVERS.forEach((server: Server) => {

  // don't know why, but opentelemetry express plugin works better when express is not yet imported
  // so we initalize tracking and then register servers using dynamic import 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
  tracing({
    serviceName: server.name,
    location: server.location,
    ...server.gdprTracingBaseConfiguration
  })
})

SERVERS.forEach((server: Server) => import('./registerServer').then(m => m.registerServer(server)));
