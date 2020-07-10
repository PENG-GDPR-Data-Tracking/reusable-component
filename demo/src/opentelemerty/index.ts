const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

import { GdprTelemetry, GdprTelemetryConfiguration } from '../../../telemetry-component';
import { Server } from '../types';

export const tracingNative = (configuration: GdprTelemetryConfiguration) => {
  const provider = new NodeTracerProvider({
    plugins: {
      // using the express plugin here does not really works
      // but the @opentracing/plugin-express must still be installed if the node app uses express
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
        ...GdprTelemetry(configuration),
        config: {
          ignoreIncomingPaths: [/\/swagger/],
        },
      },
    },
  });

  const exporter = new ZipkinExporter({
    serviceName: configuration.serviceName,
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('http-example');
};

export const tracing = (server: Server) => tracingNative({
  serviceName: server.name,
  location: server.location,
  ...server.gdprTracingBaseConfiguration
});
