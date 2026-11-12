import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx.js';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import './Nav.css';

const LINKS = [
  ['#home', 'Home'],
  ['#about', 'About'],
  ['#journey', 'Experience'],
  ['#work', 'Projects'],
  ['#services', 'Services'],
  ['#contact', 'Contact'],
];

export default function Nav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      let current = 0;
      LINKS.forEach(([hash], i) => {
        const section = document.querySelector(hash);
        if (section && section.getBoundingClientRect().top < window.innerHeight * 0.4) current = i;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav id="nav">
      {LINKS.map(([hash, label], i) => (
        <a key={hash} href={hash} className={cx(i === active && 'is-active') || undefined}>
          {label}
        </a>
      ))}
      <ThemeToggle />
    </nav>
  );
}
