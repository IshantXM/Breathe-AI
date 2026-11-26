# Testing

```sh
npm ci
npm run verify
npm run test:coverage
npm audit
```

Vitest covers AQI breakpoint boundaries, CADR and exposure math, route graph results, UI interactions, and real HTTP requests against a local Express instance. Regression tests cover the no-backend routine, malformed model output, stale cache keys, body limits, origin handling, and dialog keyboard focus. API tests use the deterministic fallback rather than calling Gemini.

Coverage is a development signal, not proof of all browser or production behavior. Real-device display, screen readers, a configured Gemini provider, and hosted deployment should be verified separately.

Local verification on Node 24: **109 passing tests in 12 suites**, **100% line coverage (864/864)**, **95.41% statement coverage**, and **87.67% branch coverage**. These results use Vitest’s default instrumented-module scope, with no new coverage exclusions. CI runs the coverage suite and enforces the 100% line threshold. Gemini provider tests use a mock; they do not verify the hosted service.

Lint and build pass. An Express smoke check also verified the built HTML, immutable stylesheet, CSP header, and health endpoint.
