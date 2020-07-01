'use strict';

const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

const EXPORTER = process.env.EXPORTER || '';

module.exports = (configuration) => {
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
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http',
        requestHook: (span, request) => {
          //console.log(request);
        },
        applyCustomAttributesOnSpan: (span, request, response) => {
          console.log('tracer.js', 'applyCustomAttributesOnSpan');

          // we set location no matter what
          span.setAttribute('gdpr.location', configuration.location);

          // we override configuration's headers if the request provides us with corresponding values
          if (request.headers) {
            span.setAttribute(
              'gdpr.ttl',
              request.headers['gdpr.ttl']
                ? request.headers['gdpr.ttl']
                : configuration.baseTTL
            );
            span.setAttribute(
              'gdpr.legalBasis',
              request.headers['gdpr.legalBasis']
                ? request.headers['gdpr.legalBasis']
                : configuration.baseLegalBasis
            );
            span.setAttribute(
              'gdpr.legitimateInterest',
              request.headers['gdpr.legitimateInterest']
                ? request.headers['gdpr.legitimateInterest']
                : configuration.baseLegitimateInterest
            );
            span.setAttribute(
              'gdpr.automatedDecisionMaking',
              request.headers['gdpr.automatedDecisionMaking']
                ? request.headers['gdpr.automatedDecisionMaking']
                : configuration.baseAutomatedDecisionMaking
            );
            span.setAttribute(
              'gdpr.purpose',
              request.headers['gdpr.purpose']
                ? request.headers['gdpr.purpose']
                : configuration.basePurpose
            );
          }
        },
      },
    },
  });

  let exporter;
  if (EXPORTER.toLowerCase().startsWith('z')) {
    exporter = new ZipkinExporter({
      serviceName: configuration.serviceName,
    });
  } else {
    exporter = new JaegerExporter({
      serviceName: configuration.serviceName,
    });
  }

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('http-example');
};
