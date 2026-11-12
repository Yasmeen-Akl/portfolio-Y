import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../data/useContent.js';
import { cx } from '../../lib/cx.js';
import { magnetic } from '../../lib/magnetic.js';
import { HiFiScreen, WireframeScreen } from './PhoneScreens.jsx';
import './Hero.css';

export default function Hero() {
  const { profile } = useContent();
  const lines = profile.hero_headline || [];

  const orb = useRef(null);
  const screen = useRef(null);
  const range = useRef(null);
  const [wireframe, setWireframe] = useState(true);
  const [used, setUsed] = useState(false);

  // Orb parallax
  useEffect(() => {
    const onScroll = () => {
      orb.current.style.marginTop = window.scrollY * 0.15 + 'px';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Wireframe → high-fidelity compare slider
  useEffect(() => {
    const rg = range.current;
    const scr = screen.current;
    let touched = false;
    let raf;

    const set = (v) => {
      scr.style.setProperty('--p', v + '%');
      setWireframe(v > 50);
    };
    const onInput = () => {
      touched = true;
      setUsed(true);
      set(rg.value);
    };
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        rg.value = +rg.value + (e.key === 'ArrowLeft' ? -6 : 6);
        rg.dispatchEvent(new Event('input'));
      }
    };
    rg.addEventListener('input', onInput);
    rg.addEventListener('keydown', onKey);

    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      rg.value = 46;
      set(46);
    } else {
      // Auto-play once: wait 900ms, then sweep 96 → 46 over 2400ms (ease-out cubic).
      rg.value = 96;
      set(96);
      const t0 = performance.now() + 900;
      const frame = (t) => {
        if (touched) return;
        const p = Math.min(Math.max((t - t0) / 2400, 0), 1);
        const v = 96 - 50 * (1 - Math.pow(1 - p, 3));
        rg.value = v;
        set(v);
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      rg.removeEventListener('input', onInput);
      rg.removeEventListener('keydown', onKey);
    };
  }, []);

  const cvLink = profile.cv_url ? { href: profile.cv_url, target: '_blank', rel: 'noreferrer' } : { href: '#' };

  return (
    <header className="hero" id="home">
      <div className="hero-orb" ref={orb} style={{ width: 260, height: 260, left: -60, top: '20%' }} />
      <div className="wrap">
        <div>
          <p className="hero-kicker">
            <b>{profile.full_name}</b>
            {` — ${profile.kicker_line}`}
          </p>
          <h1>
            {lines.map((line, i) => (
              <span className="headline-line" key={i}>
                <span>{i === lines.length - 1 ? <em>{line}</em> : line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-lead">{profile.hero_lead}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work" {...magnetic}>
              View My Work
            </a>
            <a className="btn" href="#contact" {...magnetic}>
              Get in Touch
            </a>
            <a className="cv-link" {...cvLink}>
              Download CV
            </a>
          </div>
        </div>

        <div className={cx('hero-visual', wireframe && 'is-wireframe', used && 'is-used')} id="cmpHero">
          <div className={cx('portrait', profile.hero_photo_url && 'has-photo')} id="who">
            <span className="portrait-note">hi, that’s me</span>
            <div className="portrait-frame">
              {profile.hero_photo_url ? (
                <img id="pimg" src={profile.hero_photo_url} alt={profile.full_name} />
              ) : (
                <span className="portrait-placeholder">
                  +<br />
                  Add your photo
                </span>
              )}
            </div>
            <span className="availability">
              <i />
              {profile.availability_text}
            </span>
          </div>
          <div className="phone-wrap">
            <div className="phone">
              <div className="phone-screen" ref={screen}>
                <WireframeScreen />
                <HiFiScreen />
                <input
                  id="rg"
                  className="compare-range"
                  ref={range}
                  type="range"
                  min="4"
                  max="96"
                  step="0.1"
                  defaultValue="96"
                  aria-label="Compare wireframe and high-fidelity design"
                />
                <div className="compare-line">
                  <span className="compare-knob">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
