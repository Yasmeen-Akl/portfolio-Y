import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx.js';
import './BackToTop.css';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      id="top"
      className={cx(show && 'is-visible') || undefined}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0 })}
    >
      ↑
    </button>
  );
}
