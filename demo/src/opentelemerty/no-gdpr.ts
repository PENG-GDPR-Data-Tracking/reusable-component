const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

export const tracing = () => {
  const provider = new NodeTracerProvider({
    plugins: {
      // using the express plugin here does not really works
      // but the @opentracing/plugin-express must still be installed if the node app uses express
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
        config: {
          ignoreIncomingPaths: [/\/swagger/],
        },
      },
    },
  });

  const exporter = new ZipkinExporter();

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('http-example');
};
