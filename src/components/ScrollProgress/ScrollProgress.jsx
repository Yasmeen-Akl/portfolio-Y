import { useEffect, useRef } from 'react';
import './ScrollProgress.css';

export default function ScrollProgress() {
  const bar = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      bar.current.style.width = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100 + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div id="bar" ref={bar} />;
}
