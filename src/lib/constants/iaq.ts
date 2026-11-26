// ============================================================
// src/lib/constants/iaq.ts
// Baseline room IAQ configurations and low-cost DIY air purification hacks
// ============================================================

import type { IAQRoomConfig } from '@/types';

export const DEFAULT_ROOMS: IAQRoomConfig[] = [
  {
    roomId: 'room-nursery',
    roomName: 'Infant Nursery / Children Bedroom',
    areaSqMeters: 16,
    ceilingHeightMeters: 2.8,
    occupantsCount: 2,
    hasAirPurifier: true,
    purifierCadrM3H: 180,
    indoorPlantsCount: 2,
    currentIndoorAQI: 42,
    targetIndoorAQI: 25,
  },
  {
    roomId: 'room-living',
    roomName: 'Living & Dining Room',
    areaSqMeters: 38,
    ceilingHeightMeters: 2.8,
    occupantsCount: 4,
    hasAirPurifier: true,
    purifierCadrM3H: 260,
    indoorPlantsCount: 4,
    currentIndoorAQI: 88,
    targetIndoorAQI: 40,
  },
  {
    roomId: 'room-elderly',
    roomName: 'Elderly Relatives Suite',
    areaSqMeters: 20,
    ceilingHeightMeters: 2.8,
    occupantsCount: 1,
    hasAirPurifier: false,
    purifierCadrM3H: 0,
    indoorPlantsCount: 1,
    currentIndoorAQI: 115,
    targetIndoorAQI: 35,
  },
  {
    roomId: 'room-kitchen',
    roomName: 'Kitchen & Ventilation Utility',
    areaSqMeters: 12,
    ceilingHeightMeters: 2.6,
    occupantsCount: 1,
    hasAirPurifier: false,
    purifierCadrM3H: 0,
    indoorPlantsCount: 0,
    currentIndoorAQI: 142,
    targetIndoorAQI: 50,
  },
];

export const DIY_HACKS = [
  {
    id: 'hack-corsi-box',
    title: 'Corsi-Rosenthal Box (DIY MERV 13 Filtration)',
    category: 'Filtration',
    costRating: 'Varies by fan and filter prices',
    cadrDelivery: 'Varies by design',
    materials: '1x 20" Box Fan + 4x MERV-13 Furnace Filters + Duct Tape',
    instructions: 'Follow air-cleaner assembly and fan safety guidance from your public-health agency. Use a safety-certified fan and follow its manufacturer instructions.',
    efficiencyBonus: 'Particle filtration; not a substitute for required ventilation',
  },
  {
    id: 'hack-ventilation-timing',
    title: 'Inversion-Aware Cross-Ventilation Windows',
    category: 'Ventilation',
    costRating: '$0 (Free)',
    cadrDelivery: 'Natural displacement',
    materials: 'Official local outdoor air-quality readings',
    instructions: 'Check official outdoor readings and local guidance before changing ventilation instead of relying on a fixed time of day.',
    efficiencyBonus: 'Avoids relying on an unverified forecast',
  },
  {
    id: 'hack-plants',
    title: 'Reduce Indoor Particle Sources',
    category: 'Source Control',
    costRating: 'No purchase required',
    cadrDelivery: 'Not applicable',
    materials: 'None',
    instructions: 'Avoid indoor smoking and burning candles during a smog event. Follow local guidance for cooking ventilation.',
    efficiencyBonus: 'Reduces avoidable sources of indoor particles',
  },
  {
    id: 'hack-wet-towel',
    title: 'Check Unintended Drafts',
    category: 'Sealing',
    costRating: 'Varies by home',
    cadrDelivery: 'Not applicable',
    materials: 'Check existing weatherstripping',
    instructions: 'Check nuisance drafts without blocking safety vents, appliance ventilation, or exits. Ask a qualified professional about permanent sealing.',
    efficiencyBonus: 'Potential reduction in unintended outdoor air leakage',
  },
];
