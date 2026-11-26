# BreatheWay — from an AQI number to a plan

When winter smog settles over a city, an AQI number alone doesn't tell a caregiver whether to postpone an outing, a commuter how travel options compare, or a household what size air cleaner to consider. BreatheWay demonstrates those decisions in one interactive scenario.

**Prompt Wars Challenge 6 · Urban Air Quality Assistant**. This is a **no-account prototype** using synthetic readings, sample routes, and local pledges. It is not a live monitor, forecast, medical tool, or official alert service.

## Run the demo

Use Node.js 24 (or 22.12+ on the 22 line). No API keys are required.

```sh
npm ci
npm run build
npm run server
```

Open `http://localhost:3001`. For development, run `npm run server:dev` and `npm run dev` in separate terminals and open `http://localhost:5173`. To test the static deployment locally, use `npm run preview` after building; routine and advisory generation fall back to browser rules if no API responds.

For optional Gemini drafts, copy `.env.example` to `.env` and configure `GEMINI_API_KEY` on the **server only**. A static host does not run Express: provide a separately deployed backend with `VITE_API_BASE_URL` at build time and allow the exact frontend origin in the backend's `CORS_ORIGINS`, or use the key-free browser fallback. For a reverse proxy where the public HTTPS origin differs from the backend origin, include that exact public origin too.

## A 90-second judge walkthrough

> “Most air-quality tools tell us how bad the air is. BreatheWay shows how that information could change a family's day.”

1. **Show the decision.** In a fresh browser session, open the dashboard and trigger **Simulate Winter Smog Spike** in Central Business District: the sample AQI goes from **218 to 263**. Point out the synthetic-data label and the corresponding update in the selected sector.
2. **Show the response.** In **Routine Optimizer**, choose **Asthmatic Child & Family** and generate a schedule. The elevated-AQI scenario shows **No window identified**, instead of inventing a safe outdoor time. It works even if the backend or AI service isn't available.
3. **Show two alternatives.** In **Low-Emission Transit**, compare the modeled Metro and cycling exposure for the sample trip. In **Indoor Air**, change room size and show how the required Clean Air Delivery Rate (CADR) changes. These are modeled trade-offs, not claims of real-world exposure reductions.
4. **Close with what's next.** Connect a verified feed for one city, expose source and observation age, then validate the planning guidance with local public-health partners.

Use this walkthrough for the submission recording; the older recording scripts and Lighthouse snapshot predate these changes.

## Judging evidence

| Criterion | What to inspect |
| --- | --- |
| Code quality | [Code quality](CODE_QUALITY.md): strict TypeScript, independent computation modules, shared fallback, and CI. |
| Security | [Security](SECURITY.md): no mock login or bundled cloud config, server-only AI key, request validation and dependency checks. |
| Efficiency | [Efficiency](EFFICIENCY.md): lazy feature views, cacheable assets, and a bounded API cache. |
| Testing | [Testing](TESTING.md): reproducible commands, regression tests, and coverage scope. |
| Accessibility | [Accessibility](ACCESSIBILITY.md): keyboard, focus, motion, and text alternatives; manual audit still needed. |
| Problem statement alignment | [Traceability](PROBLEM_ALIGNMENT.md): user needs, demonstrable features, and open requirements. |

```sh
npm run verify       # lint, tests, type check and production build
npm run test:coverage
npm audit
```

React/Vite render the UI; `src/lib/compute/` holds AQI, routing and filtration math; Express in `server.ts` serves the build and optional drafting endpoints. The browser and server use the same rules in `src/lib/routineGuidance.ts`.
