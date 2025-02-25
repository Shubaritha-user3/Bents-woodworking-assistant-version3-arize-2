import { registerOTel } from "@vercel/otel";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import {
  isOpenInferenceSpan,
  OpenInferenceSimpleSpanProcessor,
} from "@arizeai/openinference-vercel";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { SEMRESATTRS_PROJECT_NAME } from "@arizeai/openinference-semantic-conventions";

// Set environment variables for Phoenix
process.env["OTEL_EXPORTER_OTLP_HEADERS"] = "api_key=8bb925c083f54c64a9c:affd41e";
process.env["PHOENIX_CLIENT_HEADERS"] = "api_key=8bb925c083f54c64a9c:affd41e";
process.env["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com/v1/traces";

// For development debugging
if (process.env.NODE_ENV === "development") {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

export function register() {
  // Skip registration in browser environment
  if (typeof window !== 'undefined') return;

  registerOTel({
    serviceName: "bents-chat-app",
    attributes: {
      // This is not required but it will allow you to send traces to a specific
      // project in phoenix
      [SEMRESATTRS_PROJECT_NAME]: "phoenix-next-app",
    },
    spanProcessors: [
      new OpenInferenceSimpleSpanProcessor({
        exporter: new OTLPTraceExporter({
          headers: {
            api_key: process.env["PHOENIX_CLIENT_HEADERS"]?.split("api_key=")[1] || "8bb925c083f54c64a9c:affd41e"
          },
          url: "https://app.phoenix.arize.com/v1/traces",
        }),
        spanFilter: (span) => isOpenInferenceSpan(span),
      }),
    ],
  });
}