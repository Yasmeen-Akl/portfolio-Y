import { createContext, useEffect, useRef, useState } from 'react';

// One shared observer, same settings as the original page (threshold .15, fire once).
const callbacks = new WeakMap();
let observer;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          observer.unobserve(entry.target);
        }),
      { threshold: 0.15 },
    );
  }
  return observer;
}

// True once the nearest <Reveal> ancestor has entered the viewport.
export const RevealContext = createContext(false);

export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = getObserver();
    callbacks.set(el, () => setShown(true));
    io.observe(el);
    return () => {
      callbacks.delete(el);
      io.unobserve(el);
    };
  }, []);

  return [ref, shown];
}
