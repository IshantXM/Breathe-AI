# Code quality

- `src/lib/compute/` contains deterministic, testable math independent of React and network calls.
- `src/lib/routineGuidance.ts` shares one rules-based implementation between browser and server, so outages don't switch to contradictory logic.
- `server/` isolates API validation, caching, HTTP middleware and the optional Gemini integration from UI code.
- `npm run verify` runs Oxlint, Vitest, and the strict TypeScript/production build. The GitHub workflow runs the same checks and an npm audit on pushes and pull requests.
