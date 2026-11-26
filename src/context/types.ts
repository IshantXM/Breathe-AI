// ============================================================
// src/context/types.ts
// Context state types and action signatures
// ============================================================

import {
  TabId,
  Language,
  AccessibilityMode,
  type UrbanZone,
  type PersonaProfile,
  type IAQRoomConfig,
  type CommunityPledge,
  type CommunityAlert,
} from '@/types';

export type AppTheme = 'light' | 'dark';

export interface AppContextValue {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  zones: UrbanZone[];
  selectedZoneId: string;
  selectedZone: UrbanZone;
  setSelectedZoneId: (id: string) => void;
  updateZone: (zoneId: string, updates: Partial<UrbanZone>) => void;
  personas: PersonaProfile[];
  activePersona: PersonaProfile;
  setActivePersona: (persona: PersonaProfile) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  accessibilityMode: AccessibilityMode;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  rooms: IAQRoomConfig[];
  updateRoom: (roomId: string, updates: Partial<IAQRoomConfig>) => void;
  pledges: CommunityPledge[];
  togglePledge: (pledgeId: string) => void;
  alerts: CommunityAlert[];
  dismissAlert: (id: string) => void;
  theme: AppTheme;
  toggleTheme: () => void;
}
