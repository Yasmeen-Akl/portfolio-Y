import { useSyncExternalStore } from 'react';

// One shared theme for the whole app (site nav + dashboard).
// Light is the default; the choice is stored in localStorage under `theme`.
const KEY = 'theme';
const root = document.documentElement;
const listeners = new Set();

function stored() {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

// index.html already set data-theme before first paint; fall back to storage if it didn't.
let theme = root.dataset.theme === 'dark' || root.dataset.theme === 'light' ? root.dataset.theme : stored();
root.dataset.theme = theme;

function apply(next, persist) {
  theme = next;
  root.dataset.theme = next; // every color is a CSS variable, so the page restyles live
  if (persist) {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode / blocked storage: the toggle still works for this visit */
    }
  }
  listeners.forEach((notify) => notify());
}

// Keep other open tabs (e.g. site + dashboard) in sync.
window.addEventListener('storage', (e) => {
  if (e.key === KEY) apply(stored(), false);
});

const subscribe = (notify) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

export function useTheme() {
  const current = useSyncExternalStore(subscribe, () => theme);
  return [current, () => apply(current === 'dark' ? 'light' : 'dark', true)];
}
