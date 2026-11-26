import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

export function useDialogFocus(ref: RefObject<HTMLDivElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;

    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab' || !dialog) return;
      const stops = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const target = event.shiftKey ? stops.at(-1) : stops[0];
      const boundary = event.shiftKey ? stops[0] : stops.at(-1);
      if (target && (!dialog.contains(document.activeElement) || document.activeElement === boundary)) {
        event.preventDefault();
        target.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [ref, open, onClose]);
}
