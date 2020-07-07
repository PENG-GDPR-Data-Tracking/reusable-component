'use strict';

const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const GDPR_TELEMETRY = require('.');

const EXPORTER = process.env.EXPORTER || '';

module.exports = configuration => {
  // configuration has:
  // {
  //   serviceName: "",
  //   location: "",
  //   baseTTL: 0,
  //   baseLegalBasis: "",
  //   baseLegitimateInterest: "",
  //   baseAutomatedDecisionMaking: "",
  //   basePurpose: "",
  // }
  const provider = new NodeTracerProvider({
    plugins: {
      express: {
        enabled: true,
        path: '@opentelemetry/plugin-express',
      },
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
        ...GDPR_TELEMETRY(configuration)
      },
    },
  });

  let exporter;
  const EXPORTER_CONFIG = { serviceName: configuration.serviceName };

  if (EXPORTER.toLowerCase().startsWith('z')) {
    exporter = new ZipkinExporter(EXPORTER_CONFIG);
  } else {
    exporter = new JaegerExporter(EXPORTER_CONFIG);
  }

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('http-example');
};
