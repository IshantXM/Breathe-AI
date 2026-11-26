// ============================================================
// server/validators.ts
// Strict boundary type guards and input sanitization
// ============================================================

export function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export interface ValidatedZone {
  zoneId: string;
  zoneName: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  o3: number;
  temperatureC: number;
  windSpeedKmh: number;
  inversionRisk: boolean;
}

const ZONE_NAMES: Readonly<Record<string, string>> = {
  'Z-CENTRAL': 'Central Business District',
  'Z-INDUSTRIAL': 'North Industrial Belt',
  'Z-RESIDENTIAL': 'Greenwood Residential Sector',
  'Z-RIVERSIDE': 'Riverside Eco-Park Corridor',
  'Z-TRANSIT': 'Grand Intermodal Hub',
};

const PERSONAS: Readonly<Record<string, { name: string; subCategory: string; sensitivityLevel: string }>> = {
  'persona-asthma': { name: 'Asthmatic Child & Family', subCategory: 'asthmatic', sensitivityLevel: 'high' },
  'persona-infant': { name: 'Newborn Infant & Nursing Mother', subCategory: 'infant', sensitivityLevel: 'high' },
  'persona-elderly': { name: 'Elderly Relative (Cardiovascular Risk)', subCategory: 'elderly', sensitivityLevel: 'high' },
  'persona-commuter': { name: 'Daily Urban Commuter', subCategory: 'transit-rider', sensitivityLevel: 'moderate' },
  'persona-school': { name: 'School Run Coordinator', subCategory: 'school-run', sensitivityLevel: 'high' },
  'persona-lead': { name: 'Community Resilience Coordinator', subCategory: 'neighborhood-lead', sensitivityLevel: 'low' },
};

export const SUPPORTED_LANGUAGES = new Set(['en', 'hi', 'ar', 'es']);

export function validateZone(z: unknown): z is ValidatedZone {
  if (typeof z !== 'object' || z === null) return false;
  const obj = z as Record<string, unknown>;

  if (typeof obj.zoneId !== 'string' || !Object.prototype.hasOwnProperty.call(ZONE_NAMES, obj.zoneId)) return false;
  if (obj.zoneName !== ZONE_NAMES[obj.zoneId]) return false;
  if (!isFiniteNumber(obj.aqi) || obj.aqi < 0 || obj.aqi > 500) return false;
  if (!isFiniteNumber(obj.pm25) || obj.pm25 < 0 || obj.pm25 > 2000) return false;
  if (!isFiniteNumber(obj.pm10) || obj.pm10 < 0 || obj.pm10 > 2000) return false;
  if (!isFiniteNumber(obj.no2) || obj.no2 < 0 || obj.no2 > 1000) return false;
  if (!isFiniteNumber(obj.co) || obj.co < 0 || obj.co > 100) return false;
  if (!isFiniteNumber(obj.o3) || obj.o3 < 0 || obj.o3 > 1000) return false;
  if (!isFiniteNumber(obj.temperatureC) || obj.temperatureC < -50 || obj.temperatureC > 60) return false;
  if (!isFiniteNumber(obj.windSpeedKmh) || obj.windSpeedKmh < 0 || obj.windSpeedKmh > 250) return false;
  if (typeof obj.inversionRisk !== 'boolean') return false;

  return true;
}

export interface ValidatedPersona {
  id: string;
  name: string;
  subCategory: string;
  sensitivityLevel: 'high' | 'moderate' | 'low';
  preferredStartHour: number;
  preferredEndHour: number;
}

export function validatePersona(p: unknown): p is ValidatedPersona {
  if (typeof p !== 'object' || p === null) return false;
  const obj = p as Record<string, unknown>;

  if (typeof obj.id !== 'string' || !Object.prototype.hasOwnProperty.call(PERSONAS, obj.id)) return false;
  const knownPersona = PERSONAS[obj.id];
  if (obj.name !== knownPersona.name || obj.subCategory !== knownPersona.subCategory) return false;
  if (obj.sensitivityLevel !== knownPersona.sensitivityLevel) return false;
  if (!isFiniteNumber(obj.preferredStartHour) || obj.preferredStartHour < 0 || obj.preferredStartHour > 23) return false;
  if (!isFiniteNumber(obj.preferredEndHour) || obj.preferredEndHour < 0 || obj.preferredEndHour > 23) return false;
  if (!Number.isInteger(obj.preferredStartHour) || !Number.isInteger(obj.preferredEndHour)) return false;

  return true;
}
