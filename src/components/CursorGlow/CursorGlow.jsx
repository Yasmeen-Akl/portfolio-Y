import { useEffect, useRef } from 'react';
import './CursorGlow.css';

export default function CursorGlow() {
  const glow = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      glow.current.style.left = e.clientX + 'px';
      glow.current.style.top = e.clientY + 'px';
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return <div id="glow" ref={glow} />;
}
