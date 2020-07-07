// usage:

// const provider = new NodeTracerProvider({
//   plugins: {
//     express: {
//       enabled: true,
//       path: '@opentelemetry/plugin-express',
//       ...GDPR_TELEMETRY <--- this is how it's done 
//     },
//     http: {
//       enabled: true,
//       path: '@opentelemetry/plugin-http',
//     },
//   }
// });

module.exports = configuration => ({
  applyCustomAttributesOnSpan: (span, request, response) => {
    console.log('GDPR_TELEMETRY', 'applyCustomAttributesOnSpan, serviceName:', configuration.serviceName);

    // we set location no matter what
    span.setAttribute('gdpr.location', configuration.location);

    if (request.headers) {
      // we override configuration's headers if the request provides us with corresponding values
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
  // other fields of the node tracer provider plugin may or may not be overridden here
})