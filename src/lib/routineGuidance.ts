import type { DailyRoutinePlan, PersonaProfile, UrbanZone } from '@/types';

/**
 * A deterministic planning aid used when the API is unavailable.
 * The supplied readings are a demo snapshot, not a forecast or medical advice.
 */
export function generateRuleBasedRoutine(
  persona: Pick<PersonaProfile, 'name' | 'sensitivityLevel'>,
  zone: Pick<UrbanZone, 'zoneName' | 'aqi' | 'pm25' | 'inversionRisk'>,
): DailyRoutinePlan {
  const outdoorWindowAvailable = zone.aqi <= (persona.sensitivityLevel === 'high' ? 100 : 150);
  const startHour = outdoorWindowAvailable ? (zone.inversionRisk ? 13 : 11) : null;
  const endHour = outdoorWindowAvailable ? (zone.inversionRisk ? 16 : 17) : null;
  const hours = [7, 9, 12, 14, 17, 19, 21];

  const hourlySchedule = hours.map((hour) => {
    const morningInversion = hour <= 9 && zone.inversionRisk;
    const daytimeWindow = startHour !== null && endHour !== null && hour >= startHour && hour <= endHour;
    const recommendation = !outdoorWindowAvailable || morningInversion
      ? 'indoor-only' as const
      : 'moderate-caution' as const;

    return {
      hour,
      timeLabel: `${hour.toString().padStart(2, '0')}:00`,
      activity: recommendation === 'indoor-only'
        ? 'Prefer indoor activities; check current local guidance before going out.'
        : daytimeWindow
          ? 'If an outdoor trip is necessary, consider this planning window and recheck local readings.'
          : 'Plan essential travel; recheck current local readings before leaving.',
      recommendation,
      predictedAQI: zone.aqi,
      smogDispersionFactor: 0,
      inversionLikelihood: zone.inversionRisk ? 'high' as const : 'moderate' as const,
      healthImpactNotes: `This demo snapshot reports AQI ${zone.aqi}; it does not predict future conditions or assess individual health risk.`,
      environmentalOffsetNotes: 'No emissions offset is calculated; trip and vehicle details are not connected.',
    };
  });

  return {
    generatedAt: Date.now(),
    persona: persona.name,
    optimalOutdoorWindow: {
      startHour,
      endHour,
      rationale: outdoorWindowAvailable
        ? `Illustrative planning window based on the current demo snapshot for ${zone.zoneName}; conditions can change, so check an official local source before travel.`
        : 'This demo snapshot does not identify an outdoor activity window. Follow current official local guidance.',
    },
    hourlySchedule,
    // A rough comparison only: 0.6 m³/h breathing rate for eight hours at the
    // current PM2.5 concentration, with no filtration. It is not a personal dose.
    totalExposureScore: Math.round(zone.pm25 * 0.6 * 8 * 10) / 10,
    carbonOffsetKg: null,
    generalAdvice: [
      'Use current local air-quality agency readings; this app uses illustrative scenario data.',
      'Follow advice from your clinician and local public-health authority, especially for sensitive groups.',
      'A room air-cleaner estimate depends on the actual device CADR, room size, and leakage.',
    ],
    source: 'rules',
  };
}
