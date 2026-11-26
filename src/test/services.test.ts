import { afterEach, expect, it, vi } from 'vitest';
import { DEFAULT_PERSONAS, DEFAULT_PLEDGES, DEFAULT_ROOMS, DEFAULT_ZONES } from '@/lib/constants';
import { generateRuleBasedRoutine } from '@/lib/routineGuidance';
import { apiService } from '@/services/apiService';
import { storageService } from '@/services/storageService';
import { Language } from '@/types';

const payload = { zone: DEFAULT_ZONES[0], persona: DEFAULT_PERSONAS[0], language: Language.English };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
});

it('parses successful API replies and sends the expected request bodies', async () => {
  const plan = generateRuleBasedRoutine(payload.persona, payload.zone);
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(Response.json({ status: 'ok', uptime: 1 }))
    .mockResolvedValueOnce(Response.json(plan))
    .mockResolvedValueOnce(Response.json({ advisory: 'Check local readings.' }));
  vi.stubGlobal('fetch', fetchMock);

  await expect(apiService.fetchHealth()).resolves.toEqual({ status: 'ok', uptime: 1 });
  await expect(apiService.generateDailyRoutine(payload)).resolves.toEqual(plan);
  await expect(apiService.generateEmergencyAdvisory(payload.zone, payload.language)).resolves.toBe('Check local readings.');
  expect(fetchMock).toHaveBeenNthCalledWith(2, expect.stringMatching(/\/api\/routine-insights$/), expect.objectContaining({
    method: 'POST', body: JSON.stringify(payload), signal: expect.any(AbortSignal),
  }));
});

it('reports HTTP errors even when the backend responds with HTML or no error message', async () => {
  vi.stubGlobal('fetch', vi.fn()
    .mockResolvedValueOnce(new Response(null, { status: 503 }))
    .mockResolvedValueOnce(Response.json({ error: 'Too many requests' }, { status: 429 }))
    .mockResolvedValueOnce(new Response('<html>Offline</html>', { status: 502 }))
    .mockResolvedValueOnce(Response.json({}, { status: 400 }))
    .mockResolvedValueOnce(Response.json({}, { status: 503 })));

  await expect(apiService.fetchHealth()).rejects.toThrow('503');
  await expect(apiService.generateDailyRoutine(payload)).rejects.toThrow('Too many requests');
  await expect(apiService.generateEmergencyAdvisory(payload.zone, payload.language)).rejects.toThrow('Network error');
  await expect(apiService.generateDailyRoutine(payload)).rejects.toThrow('HTTP 400');
  await expect(apiService.generateEmergencyAdvisory(payload.zone, payload.language)).rejects.toThrow('HTTP 503');
});

it('round-trips scenario data and recovers from malformed or missing values', () => {
  const updated = [{ ...payload.zone, aqi: 250 }];
  storageService.saveZones(updated);
  storageService.saveSelectedZoneId(DEFAULT_ZONES[1].zoneId);
  storageService.saveActivePersona(DEFAULT_PERSONAS[1]);
  storageService.saveRooms(DEFAULT_ROOMS.slice(0, 1));
  storageService.savePledges(DEFAULT_PLEDGES.slice(0, 1));
  expect(storageService.getZones()).toEqual(updated);
  expect(storageService.getSelectedZoneId()).toBe(DEFAULT_ZONES[1].zoneId);
  expect(storageService.getActivePersona()).toBe(DEFAULT_PERSONAS[1]);
  expect(storageService.getRooms()).toEqual(DEFAULT_ROOMS.slice(0, 1));
  expect(storageService.getPledges()).toEqual(DEFAULT_PLEDGES.slice(0, 1));

  localStorage.setItem('breatheway_zones_v1', '[{"zoneId":"unknown"}]');
  localStorage.setItem('breatheway_active_persona_v1', '{');
  localStorage.setItem('breatheway_iaq_rooms_v1', '{}');
  localStorage.setItem('breatheway_community_pledges_v1', '[null]');
  expect(storageService.getZones()).toBe(DEFAULT_ZONES);
  expect(storageService.getActivePersona()).toBe(DEFAULT_PERSONAS[0]);
  expect(storageService.getRooms()).toBe(DEFAULT_ROOMS);
  expect(storageService.getPledges()).toBe(DEFAULT_PLEDGES);
});

it('keeps the app usable when browser storage blocks reads or writes', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Storage blocked', 'SecurityError'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Storage full', 'QuotaExceededError'); });
  expect(storageService.getZones()).toBe(DEFAULT_ZONES);
  expect(storageService.getRooms()).toBe(DEFAULT_ROOMS);
  expect(() => {
    storageService.saveZones(DEFAULT_ZONES);
    storageService.saveSelectedZoneId(payload.zone.zoneId);
    storageService.saveActivePersona(payload.persona);
    storageService.saveRooms(DEFAULT_ROOMS);
    storageService.savePledges(DEFAULT_PLEDGES);
  }).not.toThrow();
});
