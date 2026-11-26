// ============================================================
// src/lib/compute/aqiBreakpoints.ts
// EPA AQI Category mapping, color coding, and sub-index calculation
// ============================================================

import { AQICategory } from '@/types';
import { assertFiniteNumber, linearInterpolation } from './asserts';

/**
 * Calculates the EPA AQI Category based on numerical AQI index (0-500+).
 */
export function calculateAQICategory(aqi: number): AQICategory {
  assertFiniteNumber(aqi, 'aqi');
  if (aqi < 0) {
    throw new RangeError(`AQI cannot be negative. Received: ${aqi}`);
  }

  if (aqi <= 50) return AQICategory.Good;
  if (aqi <= 100) return AQICategory.Moderate;
  if (aqi <= 150) return AQICategory.UnhealthySensitive;
  if (aqi <= 200) return AQICategory.Unhealthy;
  if (aqi <= 300) return AQICategory.VeryUnhealthy;
  return AQICategory.Hazardous;
}

/**
 * Maps an AQI value to its standardized high-contrast design token hex color.
 */
export function getAQIColor(aqi: number): string {
  assertFiniteNumber(aqi, 'aqi');
  if (aqi <= 50) return '#10b981'; // Emerald 500
  if (aqi <= 100) return '#f59e0b'; // Amber 500
  if (aqi <= 150) return '#f97316'; // Orange 500
  if (aqi <= 200) return '#ef4444'; // Red 500
  if (aqi <= 300) return '#a855f7'; // Purple 500
  return '#881337'; // Deep Maroon
}

/**
 * Computes the US EPA PM2.5 AQI sub-index using the May 2024 breakpoints.
 * PM2.5 is truncated (not rounded) to one decimal place before interpolation.
 */
export function calculatePM25SubIndex(pm25: number): number {
  assertFiniteNumber(pm25, 'pm25');
  if (pm25 < 0) {
    throw new RangeError(`PM2.5 concentration cannot be negative. Received: ${pm25}`);
  }

  const c = Math.floor(pm25 * 10 + Number.EPSILON) / 10;

  if (c <= 9.0) return linearInterpolation(c, 0.0, 9.0, 0, 50);
  if (c <= 35.4) return linearInterpolation(c, 9.1, 35.4, 51, 100);
  if (c <= 55.4) return linearInterpolation(c, 35.5, 55.4, 101, 150);
  if (c <= 125.4) return linearInterpolation(c, 55.5, 125.4, 151, 200);
  if (c <= 225.4) return linearInterpolation(c, 125.5, 225.4, 201, 300);
  if (c <= 325.4) return linearInterpolation(c, 225.5, 325.4, 301, 500);
  return 500;
}
