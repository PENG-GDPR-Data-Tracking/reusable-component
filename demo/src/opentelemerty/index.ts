const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

import { GdprTelemetry, GdprTelemetryConfiguration } from '../../../telemetry-component'

export const tracing = (configuration: GdprTelemetryConfiguration) => {
  const provider = new NodeTracerProvider({
    plugins: {
      express: {
        enabled: true,
        path: '@opentelemetry/plugin-express',
      },
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
        ...GdprTelemetry(configuration)
      },
    },
  });

  let exporter = new ZipkinExporter({
    serviceName: configuration.serviceName,
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('http-example');
};
