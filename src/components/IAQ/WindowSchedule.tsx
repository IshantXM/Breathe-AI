import { WindowIcon } from '@/components/ui/Icons';

interface WindowScheduleProps {
  currentAqi: number;
}

export function WindowSchedule({ currentAqi }: WindowScheduleProps) {
  const elevated = currentAqi > 100;

  return (
    <section className="glass-panel rounded-2xl p-6 sm:p-8" aria-labelledby="window-guidance-title">
      <h3 id="window-guidance-title" className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
        <WindowIcon size={18} />
        Window Ventilation Guidance
      </h3>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300" role="status">
        Demo AQI {currentAqi}. {elevated
          ? 'This scenario does not suggest opening windows for fresh air.'
          : 'This lower-AQI snapshot illustrates when outdoor ventilation might be an option, but it does not establish a safe time.'}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        Check official outdoor readings and local guidance before changing ventilation. A clock time or simulated inversion does not tell you whether outdoor air is clean. This tool does not measure indoor air or replace ventilation required for safety.
      </p>
    </section>
  );
}
