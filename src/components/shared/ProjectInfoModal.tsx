import { Modal } from '@/components/ui/Modal';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectInfoModal({ isOpen, onClose }: ProjectInfoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About this BreatheWay demo"
      description="A transparent prototype for exploring air-quality planning ideas."
      maxWidth="md"
    >
      <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <p>
          This demo uses illustrative, locally stored scenarios. It is not connected to live air-quality
          monitors, emergency services, or a shared community database.
        </p>
        <p>
          The routine planner uses an optional server-side AI service and falls back to local rules when
          that service is unavailable. Generated guidance is a draft, not an official alert or medical advice.
        </p>
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          Check your local air-quality authority for current readings and follow guidance from your clinician
          or public-health authority.
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          No account is required. Preferences, scenario changes, and pledges stay in this browser.
        </p>
      </div>
    </Modal>
  );
}
