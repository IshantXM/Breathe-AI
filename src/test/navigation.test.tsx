import { afterEach, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

afterEach(() => {
  localStorage.clear();
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
});

it('moves desktop tab focus with arrows, Home, End, and wraparound', async () => {
  const user = userEvent.setup();
  render(<App />);
  const tabs = screen.getAllByRole('tab');
  tabs[0].focus();
  await user.keyboard('{ArrowDown}');
  expect(tabs[1]).toHaveFocus();
  expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  await user.keyboard('{End}');
  expect(tabs.at(-1)).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(tabs[0]).toHaveFocus();
  await user.keyboard('{ArrowUp}');
  expect(tabs.at(-1)).toHaveFocus();
  await user.keyboard('{Home}');
  expect(tabs[0]).toHaveFocus();
  expect(screen.getByRole('tabpanel')).toHaveAttribute('id', tabs[0].getAttribute('aria-controls'));
});

it('traps and restores mobile menu focus, applies preferences, and navigates', async () => {
  const user = userEvent.setup();
  render(<App />);
  const header = screen.getByRole('banner');
  const opener = within(header).getByRole('button', { name: 'Open navigation menu' });
  await user.click(opener);
  const drawer = screen.getByRole('dialog', { name: 'Navigation menu' });
  const close = within(drawer).getByRole('button', { name: 'Close menu' });
  const accessibility = within(drawer).getByLabelText('Accessibility');
  expect(close).toHaveFocus();
  await user.tab({ shift: true });
  expect(accessibility).toHaveFocus();
  await user.selectOptions(accessibility, 'reduced-motion');
  expect(drawer.closest('[data-motion]')).toHaveAttribute('data-motion', 'reduced');
  await user.selectOptions(within(drawer).getByLabelText('Language'), 'ar');
  expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  expect(document.documentElement).toHaveAttribute('lang', 'ar');
  await user.selectOptions(within(drawer).getByLabelText('Language'), 'en');
  await user.keyboard('{Escape}');
  expect(opener).toHaveFocus();
  expect(drawer).not.toBeInTheDocument();
  await user.click(opener);
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /transit/i }));
  expect(await screen.findByRole('heading', { name: /low-exposure commute/i })).toBeInTheDocument();
  expect(opener).toHaveAttribute('aria-expanded', 'false');
  await user.click(opener);
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'About this demo' }));
  expect(await screen.findByRole('dialog', { name: /about this breatheway demo/i })).toBeInTheDocument();
});

it('updates the selected zone by map keyboard activation and by desktop picker', async () => {
  const user = userEvent.setup();
  render(<App />);
  const map = screen.getByRole('button', { name: /North Industrial Belt, AQI 342/ });
  map.focus();
  await user.keyboard('{Enter}');
  const picker = screen.getByLabelText('Change Sector Telemetry');
  expect(picker).toHaveValue('Z-INDUSTRIAL');
  const card = screen.getByRole('article', { name: /Riverside Eco-Park Corridor/ });
  await user.click(within(card).getByRole('button', { name: 'Switch Telemetry' }));
  expect(picker).toHaveValue('Z-RIVERSIDE');
  await user.selectOptions(picker, 'Z-CENTRAL');
  expect(within(screen.getByRole('article', { name: /Central Business District/ })).getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await user.click(map);
  expect(picker).toHaveValue('Z-INDUSTRIAL');
  await user.click(within(card).getByRole('heading'));
  expect(picker).toHaveValue('Z-RIVERSIDE');
});

it('dismisses a scenario notice without removing the dashboard', async () => {
  const user = userEvent.setup();
  render(<App />);
  const notices = screen.getByRole('region', { name: 'Demo scenario notices' });
  const buttons = within(notices).getAllByRole('button', { name: /dismiss alert/i });
  await user.click(buttons[0]);
  expect(buttons[0]).not.toBeInTheDocument();
  expect(screen.getByText(/no live air-quality monitors are connected/i)).toBeInTheDocument();
});

it('persists desktop theme changes and applies language and contrast preferences', async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  const sidebar = screen.getByRole('complementary', { name: /platform sidebar/i });
  await user.click(within(sidebar).getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  await user.selectOptions(within(sidebar).getByLabelText('Language'), 'es');
  expect(document.documentElement).toHaveAttribute('lang', 'es');
  await user.selectOptions(within(sidebar).getByLabelText('Accessibility Mode'), 'high-contrast');
  expect(sidebar.closest('.contrast-125')).not.toBeNull();
  view.unmount();
  render(<App />);
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
});
