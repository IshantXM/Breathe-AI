# Problem statement alignment

**Challenge 6 — Urban Air Quality Assistant.** This trace maps the problem description available in the repository. Confirm requirements against the official hackathon brief before submission.

| User need | Demo evidence | Limit |
| --- | --- | --- |
| Understand local winter smog | Dashboard: five sample sectors, pollutant breakdowns, inversion scenario, and what-if controls | No live observations, validated forecast, or measured inversion profile |
| Decide whether to reschedule an outing | Routine: caregiver personas, conservative outdoor-window rules, optional AI-drafted advice | No individual medical risk prediction or official safety guarantee |
| Compare travel trade-offs | Transit: Dijkstra on a documented sample graph, mode table with modeled time, PM2.5 and CO₂ | No map directions, live transit feeds, or route-level measurements |
| Size household air filtration | Indoor Air: room volume, CADR and idealized removal-time estimates; ventilation guidance | No indoor measurement or independent device certification |
| Coordinate neighborhood action | Community: local pledge toggles, illustrative estimates, and reviewable advisory drafts | No shared database, dispatch, or verified savings |
| Include people who use assistive technology | Keyboard navigation, text alternatives, dialog focus handling, reduced motion and partial localization | Manual browser and assistive-technology audit pending |

The PM2.5 helper uses the [US EPA 24-hour breakpoint table](https://aqs.epa.gov/aqsweb/documents/codetables/aqi_breakpoints.html) revised in May 2024 and caps the app's display scale at 500. This does not convert the dashboard’s sample values into regulatory observations or a NowCast. If the brief requires a live feed, that remains the highest-priority gap.
