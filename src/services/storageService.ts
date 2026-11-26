// ============================================================
// src/services/storageService.ts
// Offline-first resilient browser persistence with safeParse<T>()
// Per CODING_CONVENTIONS.md §5 & ARCHITECTURE_PATTERNS.md §4.2
// ============================================================

import type {
  UrbanZone,
  PersonaProfile,
  IAQRoomConfig,
  CommunityPledge,
} from '@/types';
import {
  DEFAULT_ZONES,
  DEFAULT_PERSONAS,
  DEFAULT_ROOMS,
  DEFAULT_PLEDGES,
} from '@/lib/constants';

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== typeof fallback) return fallback;
    if (Array.isArray(fallback) && (!Array.isArray(parsed) || parsed.length === 0 || parsed.some((item) => !item || typeof item !== 'object'))) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

const STORAGE_KEYS = {
  ZONES: 'breatheway_zones_v1',
  SELECTED_ZONE: 'breatheway_selected_zone_id_v1',
  PERSONA: 'breatheway_active_persona_v1',
  ROOMS: 'breatheway_iaq_rooms_v1',
  PLEDGES: 'breatheway_community_pledges_v1',
  LANGUAGE: 'breatheway_language_v1',
  ACCESSIBILITY_MODE: 'breatheway_accessibility_mode_v1',
} as const;

export const storageService = {
  getZones(): UrbanZone[] {
    if (typeof window === 'undefined') return DEFAULT_ZONES;
    const zones = readStored(STORAGE_KEYS.ZONES, DEFAULT_ZONES);
    return zones.every((zone) => DEFAULT_ZONES.some((demo) => zone.zoneId === demo.zoneId) && Number.isFinite(zone.aqi) && zone.aqi >= 0 && Number.isFinite(zone.pm25) && zone.pm25 >= 0 && Array.isArray(zone.history))
      ? zones : DEFAULT_ZONES;
  },

  saveZones(zones: UrbanZone[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
    } catch {
      // Storage quota or sandboxed iframe
    }
  },

  getSelectedZoneId(): string {
    if (typeof window === 'undefined') return DEFAULT_ZONES[0].zoneId;
    return readStored(STORAGE_KEYS.SELECTED_ZONE, DEFAULT_ZONES[0].zoneId);
  },

  saveSelectedZoneId(zoneId: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_ZONE, JSON.stringify(zoneId));
    } catch {
      // Ignored
    }
  },

  getActivePersona(): PersonaProfile {
    if (typeof window === 'undefined') return DEFAULT_PERSONAS[0];
    const saved = readStored(STORAGE_KEYS.PERSONA, DEFAULT_PERSONAS[0]);
    return DEFAULT_PERSONAS.find((persona) => persona.id === saved.id) ?? DEFAULT_PERSONAS[0];
  },

  saveActivePersona(persona: PersonaProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
    } catch {
      // Ignored
    }
  },

  getRooms(): IAQRoomConfig[] {
    if (typeof window === 'undefined') return DEFAULT_ROOMS;
    return readStored(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS);
  },

  saveRooms(rooms: IAQRoomConfig[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch {
      // Ignored
    }
  },

  getPledges(): CommunityPledge[] {
    if (typeof window === 'undefined') return DEFAULT_PLEDGES;
    return readStored(STORAGE_KEYS.PLEDGES, DEFAULT_PLEDGES);
  },

  savePledges(pledges: CommunityPledge[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PLEDGES, JSON.stringify(pledges));
    } catch {
      // Ignored
    }
  },
};
