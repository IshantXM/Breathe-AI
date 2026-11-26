import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DEFAULT_PERSONAS, DEFAULT_ZONES } from '@/lib/constants';
import { generateRuleBasedRoutine } from '@/lib/routineGuidance';

const { generateContent, getGenerativeModel } = vi.hoisted(() => ({
  generateContent: vi.fn(), getGenerativeModel: vi.fn(),
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel = getGenerativeModel;
  },
}));

const persona = DEFAULT_PERSONAS[0];
const lowerAqi = DEFAULT_ZONES[3];
const highAqi = DEFAULT_ZONES[0];

function providerReply(text: string) {
  generateContent.mockResolvedValueOnce({ response: { text: () => text } });
}

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('GEMINI_API_KEY', 'not-a-real-key');
  generateContent.mockReset();
  getGenerativeModel.mockReset().mockReturnValue({ generateContent });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it('accepts provider advice but retains rules-based metrics and planning decisions', async () => {
  const { getAiRoutineInsights } = await import('../../server/aiService');
  const baseline = generateRuleBasedRoutine(persona, lowerAqi);
  const advice = ['Check local air-quality readings before travel.'];
  providerReply(JSON.stringify({ ...baseline, carbonOffsetKg: 500, totalExposureScore: 0, generalAdvice: advice }));
  const result = await getAiRoutineInsights(persona, lowerAqi, 'en');
  expect(result).toMatchObject({ source: 'gemini', generalAdvice: advice, carbonOffsetKg: null, totalExposureScore: baseline.totalExposureScore });
  expect(result.optimalOutdoorWindow).toEqual(baseline.optimalOutdoorWindow);
  expect(getGenerativeModel).toHaveBeenCalledWith(expect.objectContaining({ model: expect.any(String) }), { timeout: 7000 });
});

it('falls back with no provider text, an invalid result, malformed JSON, or a rejected provider request', async () => {
  const { getAiRoutineInsights } = await import('../../server/aiService');
  const log = vi.spyOn(console, 'warn').mockImplementation(() => {});
  providerReply('no data');
  providerReply('{"hourlySchedule":[]}');
  providerReply('{ invalid }');
  generateContent.mockRejectedValueOnce(new Error('Provider unavailable'));
  for (let i = 0; i < 4; i++) {
    await expect(getAiRoutineInsights(persona, lowerAqi, 'en')).resolves.toMatchObject({ source: 'rules' });
  }
  expect(log).toHaveBeenCalledTimes(2);
});

it('keeps elevated-AQI routine guidance deterministic', async () => {
  const { getAiRoutineInsights } = await import('../../server/aiService');
  providerReply(JSON.stringify(generateRuleBasedRoutine(persona, lowerAqi)));
  await expect(getAiRoutineInsights(persona, highAqi, 'en')).resolves.toMatchObject({
    source: 'rules', optimalOutdoorWindow: { startHour: null, endHour: null },
  });
});

it('trims advisory drafts and falls back for empty, oversized, or failed responses', async () => {
  const { getEmergencyAdvisoryText } = await import('../../server/aiService');
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  providerReply('  Check local guidance.  ');
  providerReply('  ');
  providerReply('x'.repeat(1201));
  generateContent.mockRejectedValueOnce(new Error('Provider unavailable'));
  await expect(getEmergencyAdvisoryText(lowerAqi, 'en')).resolves.toBe('Check local guidance.');
  await expect(getEmergencyAdvisoryText(lowerAqi, 'en')).resolves.toContain('No inversion flag is active');
  await expect(getEmergencyAdvisoryText(highAqi, 'en')).resolves.toContain('An inversion flag is active');
  await expect(getEmergencyAdvisoryText(highAqi, 'en')).resolves.toContain('not a live or official alert');
});
