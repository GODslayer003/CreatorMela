import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      const isDialogOpen = !!document.querySelector('[data-state="open"][role="dialog"]');

      for (const [key, callback] of Object.entries(shortcuts)) {
        const parts = key.toLowerCase().split('+');
        const modifier = parts.length > 1 ? parts.slice(0, -1) : [];
        const mainKey = parts[parts.length - 1];

        const needsCtrl = modifier.includes('ctrl') || modifier.includes('cmd');
        const needsShift = modifier.includes('shift');
        const needsAlt = modifier.includes('alt');

        if (isInputFocused && !needsCtrl) continue;
        if (isDialogOpen && !needsCtrl) continue;

        const ctrlOk = needsCtrl ? e.ctrlKey || e.metaKey : true;
        const shiftOk = needsShift ? e.shiftKey : true;
        const altOk = needsAlt ? e.altKey : true;
        const keyOk = e.key.toLowerCase() === mainKey || e.key === mainKey;

        if (ctrlOk && shiftOk && altOk && keyOk) {
          e.preventDefault();
          e.stopPropagation();
          callback();
          return;
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [handler]);
}
