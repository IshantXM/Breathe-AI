# Efficiency

- Routine, transit, indoor air, community, and demo information load on demand. The demo no longer ships the optional Firebase/auth chunks (~178 kB gzip for the former Firebase vendor chunk alone).
- The dashboard uses native SVG. The stylesheet is a hashed standalone asset, so it can be reused rather than downloaded with every HTML response. Express and static deployment configuration provide immutable caching for hashed assets.
- AI responses use a per-process LRU bounded to 100 entries with a five-minute TTL. Cache keys include relevant scenario data rather than only AQI, avoiding reuse when PM2.5 changes but AQI doesn't. Client and provider timeouts bound user-visible waits.
- The verified build reports ~96.08 kB gzip for the initial JavaScript chunks, 16.35 kB for CSS, and 1.27 kB for HTML. Reproduce with `npm run build`. These are transfer-size estimates, not browser runtime or a measured LLM latency guarantee.
