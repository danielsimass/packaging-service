import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter as OTLPMetricExporterGrpc } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter as OTLPTraceExporterGrpc } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { MetricReader, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SpanExporter } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

export const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'packaging_api',
});

function setupTraceExporter(): SpanExporter | undefined {
  return new OTLPTraceExporterGrpc({
    timeoutMillis: 10000,
  });
}

function setupMetricReader(): MetricReader | undefined {
  return new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporterGrpc({
      timeoutMillis: 10000,
    }),
  });
}

export const traceExporter = setupTraceExporter();
const metricReader = setupMetricReader();

const sdk = new NodeSDK({
  traceExporter,
  metricReader,
  resource,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-net': {
        enabled: false,
      },
    }),
  ],
});

sdk.start();
console.log('[OpenTelemetry] SDK started!');

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
