import { useContext, useEffect, useRef, useState } from 'react';
import { RevealContext } from '../../hooks/useReveal.js';

// Counts from 0 to `value` over 1400ms (ease-out cubic) once its <Reveal> parent is visible.
export default function CountUp({ value }) {
  const shown = useContext(RevealContext);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!shown) return undefined;
    if (done.current) {
      setN(value); // content changed after the animation already played
      return undefined;
    }
    let raf;
    let start = null;
    const frame = (t) => {
      start = start || t;
      const p = Math.min((t - start) / 1400, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(frame);
      else done.current = true;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [shown, value]);

  return <span data-n={value}>{n}</span>;
}
