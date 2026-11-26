import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { DEFAULT_PERSONAS, DEFAULT_ZONES } from '@/lib/constants';
import { generateRuleBasedRoutine } from '@/lib/routineGuidance';
import { validateRoutineResult } from '../../server/aiService';
import { getCachedInsight, insightCache, setCachedInsight } from '../../server/cache';
import { useAppContext } from '@/context/AppContext';
import { Sparkline } from '@/components/shared/Sparkline';

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

it('restores focus on dialog close and keeps Tab inside the dialog', async () => {
  const user = userEvent.setup();
  render(<App />);
  const trigger = screen.getByRole('button', { name: /about the breatheway demo/i });
  await user.click(trigger);
  await screen.findByRole('dialog', { name: /about this breatheway demo/i });
  const close = screen.getByRole('button', { name: /close dialog/i });
  expect(close).toHaveFocus();
  await user.tab();
  expect(close).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(trigger).toHaveFocus();
});

it('generates a labeled local routine when no backend is available', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('tab', { name: /routine/i }));
  await user.click(await screen.findByRole('button', { name: /generate smart schedule/i }));
  expect(await screen.findByText(/source: local rules-based fallback/i)).toBeInTheDocument();
  expect(screen.getByText(/no window identified/i)).toBeInTheDocument();
});

it('labels a successful routine response and hides it when the persona changes', async () => {
  const plan = generateRuleBasedRoutine(DEFAULT_PERSONAS[0], DEFAULT_ZONES[0]);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(plan)));
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('tab', { name: /routine/i }));
  await user.click(await screen.findByRole('button', { name: /generate smart schedule/i }));
  expect(await screen.findByText(/source: local rules-based fallback/i)).toBeInTheDocument();
  expect(screen.queryByText(/service is unavailable/i)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /newborn infant/i }));
  expect(screen.queryByText(/source: local rules-based fallback/i)).not.toBeInTheDocument();
});

it('renders an advisory draft with and without an available backend', async () => {
  vi.stubGlobal('fetch', vi.fn()
    .mockResolvedValueOnce(Response.json({ advisory: 'An example advisory draft.' }))
    .mockRejectedValueOnce(new Error('offline')));
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('tab', { name: /community/i }));
  const generate = await screen.findByRole('button', { name: /generate localized advisory/i });
  await user.click(generate);
  expect(await screen.findByText('An example advisory draft.')).toBeInTheDocument();
  await user.click(generate);
  const draft = screen.getByRole('region', { name: /generated community advisory/i });
  expect(await within(draft).findByText(/not a live or official alert/i)).toBeInTheDocument();
  const acknowledge = screen.getAllByRole('button', { name: 'Acknowledge' });
  await user.click(acknowledge[0]);
  expect(screen.getAllByRole('button', { name: 'Acknowledge' })).toHaveLength(acknowledge.length - 1);
});

it('updates the CADR calculator when a purifier is added and removed', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('tab', { name: /indoor air/i }));
  const cadr = await screen.findByLabelText(/purifier clean air delivery rate/i);
  fireEvent.change(cadr, { target: { value: '600' } });
  expect(cadr).toHaveValue('600');
  expect(screen.queryByText('No Purifier')).not.toBeInTheDocument();
  fireEvent.change(cadr, { target: { value: '0' } });
  expect(cadr).toHaveValue('0');
  expect(screen.getByText('No Purifier')).toBeInTheDocument();
});

it('updates the transport results when the route selectors change', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('tab', { name: /transit/i }));
  const origin = await screen.findByLabelText(/commute origin/i);
  const destination = screen.getByLabelText(/destination waypoint/i);
  await user.selectOptions(origin, 'N-METRO-HUB');
  expect(screen.getByRole('table')).toBeInTheDocument();
  await user.selectOptions(destination, 'N-METRO-HUB');
  expect(screen.getByText(/no trip to compare/i)).toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

it('shows an explicit empty state instead of plotting missing telemetry', () => {
  render(<Sparkline values={[]} />);
  expect(screen.getByText('No telemetry data')).toBeInTheDocument();
  expect(document.querySelector('svg')).toBeNull();
});

it('reports a missing app context provider instead of returning invalid state', () => {
  expect(() => renderHook(() => useAppContext())).toThrow('useAppContext must be used within an AppContextProvider');
});

it('rejects structurally invalid model results', () => {
  const plan = generateRuleBasedRoutine(DEFAULT_PERSONAS[0], DEFAULT_ZONES[0]);
  expect(validateRoutineResult(plan)).toBe(true);
  expect(validateRoutineResult({ ...plan, hourlySchedule: [{}] })).toBe(false);
  expect(validateRoutineResult({ ...plan, optimalOutdoorWindow: { startHour: 20, endHour: 3, rationale: 'Invalid' } })).toBe(false);
});

it('expires old cache results and evicts the least recently used entry', () => {
  vi.useFakeTimers();
  insightCache.clear();
  try {
    for (let i = 0; i < 100; i++) setCachedInsight(String(i), i);
    expect(getCachedInsight('0')).toBe(0);
    setCachedInsight('100', 100);
    expect(insightCache.size).toBe(100);
    expect(getCachedInsight('1')).toBeUndefined();
    expect(getCachedInsight('0')).toBe(0);
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(getCachedInsight('0')).toBeUndefined();
  } finally {
    vi.useRealTimers();
    insightCache.clear();
  }
});
