# Security

- The app requires no account and does not collect passwords. The mock sign-in and OTP flow and hard-coded Firebase configuration were removed. `firestore.rules` is a reference only, not a deployed or exercised integration.
- Keep `GEMINI_API_KEY` in server configuration, never in a `VITE_` variable. AI requests use demo zone readings and preset persona data. The app never passes the model tools to change a schedule, send an alert, or access the browser.
- Express applies Helmet, exact configured cross-origin policy, a 15 KB JSON limit, per-IP AI request limits, and generic errors. Demo profile and zone text are allowlisted; numeric fields are range-checked. AI routine output is validated; its advice does not set the outdoor window or compute exposure metrics.
- CORS is not authentication and the per-process cache and limiter are not distributed. Provision HTTPS, provider quotas, monitoring, and deployment-level abuse controls before hosting a public AI endpoint. Set `CORS_ORIGINS` explicitly for split hosting.
- `npm audit` reported no known dependency vulnerabilities in the locally verified lockfile. This is not a penetration test or production certification.
