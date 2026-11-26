// ============================================================
// src/config/branding.ts
// Centralized Rebranded Configuration: BreatheWay
// Warm & community-friendly, emphasizing safe passage through polluted cities.
// ============================================================

export const BRANDING = {
  productName: 'BreatheWay',
  productNameShort: 'BreatheWay',
  suiteName: 'BreatheWay Safe Passage & Clean Air Platform',
  tagline: 'Safe passage through polluted cities • Warm community clean air intelligence',
  companyName: 'BreatheWay Community Technologies Inc.',
  version: '3.0.0 Community Edition',
  buildTag: '2026.11-COMMUNITY',
  supportEmail: 'support@breatheway.org',
  portalName: 'Community Safe Passage & Clean Air Portal',

  // Core Engine
  engineName: 'BreatheWay Core',
  engineBadge: 'Powered by BreatheWay Community Engine',

  // Compliance & Standards badges
  standards: [
    { label: 'Accessible UI', tooltip: 'Keyboard access and text alternatives for visualizations' },
    { label: 'US EPA PM2.5', tooltip: 'Updated May 2024 PM2.5 concentration breakpoints' },
    { label: 'Scenario Demo', tooltip: 'Illustrative sample values; no live monitors connected' },
    { label: 'Optional AI', tooltip: 'Server-side routine drafts with a local rules-based fallback' },
  ],

  // Theme primary palettes - Warm, community-friendly & accessible
  colors: {
    primary: '#059669', // Emerald clean air
    primaryHover: '#047857',
    secondary: '#d97706', // Warm amber / community warmth
    accent: '#0d9488', // Teal safe passage
    backgroundLight: '#fafaf9', // Warm stone/paper canvas
    backgroundDark: '#0c0f14',
    surfaceLight: '#ffffff',
    surfaceDark: '#141a24',
    textPrimaryLight: '#1c1917',
    textPrimaryDark: '#f8fafc',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
} as const;

export type BrandingConfig = typeof BRANDING;
