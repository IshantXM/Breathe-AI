// ============================================================
// src/types/routine.ts
// Persona profiles, hourly schedules, and GenAI routine plans
// ============================================================

export interface PersonaProfile {
  id: string;
  name: string;
  subCategory: 'infant' | 'elderly' | 'asthmatic' | 'school-run' | 'cyclist' | 'transit-rider' | 'neighborhood-lead';
  sensitivityLevel: 'high' | 'moderate' | 'low';
  preferredStartHour: number;
  preferredEndHour: number;
  description: string;
}

export interface RoutineHour {
  hour: number;
  timeLabel: string;
  activity: string;
  recommendation: 'safe-outdoor' | 'moderate-caution' | 'indoor-only' | 'mask-required';
  predictedAQI: number;
  smogDispersionFactor: number;
  inversionLikelihood: 'low' | 'moderate' | 'high';
  healthImpactNotes: string;
  environmentalOffsetNotes: string;
}

export interface DailyRoutinePlan {
  generatedAt: number;
  persona: string;
  optimalOutdoorWindow: {
    startHour: number | null;
    endHour: number | null;
    rationale: string;
  };
  hourlySchedule: RoutineHour[];
  totalExposureScore: number;
  carbonOffsetKg: number | null;
  generalAdvice: string[];
  source?: 'gemini' | 'rules';
}
