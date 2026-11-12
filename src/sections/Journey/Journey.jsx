import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useContent } from '../../data/useContent.js';
import { cx } from '../../lib/cx.js';
import Reveal from '../../components/Reveal/Reveal.jsx';
import Eyebrow from '../../components/Eyebrow/Eyebrow.jsx';
import TagList from '../../components/TagList/TagList.jsx';
import './Journey.css';

const HANDLES = [
  { left: -5, top: -5 },
  { right: -5, top: -5 },
  { left: -5, bottom: -5 },
  { right: -5, bottom: -5 },
];

// Figma-style canvas: frames joined by dashed connectors, with a cursor that
// hops from frame to frame every 2.8s (or follows the visitor's pointer).
export default function Journey() {
  const { journey, profile } = useContent();
  const count = journey.length;
  const firstName = (profile.full_name || '').split(' ')[0];

  const canvas = useRef(null);
  const frames = useRef([]);
  const hold = useRef(false);
  const [visible, setVisible] = useState({});
  const [selected, setSelected] = useState(0);
  const [geo, setGeo] = useState({ w: 0, h: 0, wires: [], spots: [] });
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion:reduce)').matches);

  // Measure frames → connector paths + cursor resting spots.
  const measure = useCallback(() => {
    const cv = canvas.current;
    const frs = frames.current.slice(0, count);
    if (!cv || frs.some((f) => !f)) return;
    const wires = [];
    for (let i = 0; i < frs.length - 1; i++) {
      const a = frs[i];
      const b = frs[i + 1];
      let sx, sy, ex, ey, c;
      if (b.offsetLeft > a.offsetLeft + a.offsetWidth * 0.5) {
        sx = a.offsetLeft + a.offsetWidth;
        sy = a.offsetTop + a.offsetHeight / 2;
        ex = b.offsetLeft;
        ey = b.offsetTop + b.offsetHeight / 2;
        const k = (ex - sx) / 2;
        c = `C${sx + k} ${sy} ${ex - k} ${ey}`;
      } else {
        sx = a.offsetLeft + a.offsetWidth / 2;
        sy = a.offsetTop + a.offsetHeight;
        ex = b.offsetLeft + b.offsetWidth / 2;
        ey = b.offsetTop;
        const k = (ey - sy) / 2;
        c = `C${sx} ${sy + k} ${ex} ${ey - k}`;
      }
      wires.push({ d: `M${sx} ${sy} ${c} ${ex} ${ey}`, sx, sy, ex, ey });
    }
    const spots = frs.map((f) => ({
      x: f.offsetLeft + f.offsetWidth * 0.68,
      y: f.offsetTop + f.offsetHeight * 0.42,
    }));
    setGeo({ w: cv.offsetWidth, h: cv.offsetHeight, wires, spots });
  }, [count]);

  useLayoutEffect(measure, [measure, journey]);

  useEffect(() => {
    const timer = setTimeout(measure, 400);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    document.fonts?.ready.then(measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
    };
  }, [measure]);

  // Frames fade in one by one; the visitor's pointer takes over the cursor while hovering.
  useEffect(() => {
    const frs = frames.current.slice(0, count).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = frs.indexOf(entry.target);
          setVisible((v) => ({ ...v, [i]: true }));
          io.unobserve(entry.target);
        }),
      { threshold: 0.25 },
    );
    const cleanups = frs.map((f, i) => {
      io.observe(f);
      const enter = () => {
        hold.current = true;
        setSelected(i);
      };
      const leave = () => {
        hold.current = false;
      };
      f.addEventListener('pointerenter', enter);
      f.addEventListener('pointerleave', leave);
      return () => {
        f.removeEventListener('pointerenter', enter);
        f.removeEventListener('pointerleave', leave);
      };
    });
    return () => {
      io.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, [count]);

  useEffect(() => {
    if (!count) return undefined;
    const timer = setInterval(() => {
      if (!hold.current) setSelected((k) => (k + 1) % count);
    }, 2800);
    return () => clearInterval(timer);
  }, [count]);

  const current = count ? selected % count : 0;
  const spot = geo.spots[current];

  return (
    <section id="journey">
      <div className="wrap">
        <Reveal>
          <Eyebrow>My journey</Eyebrow>
          <h2>
            Where I’ve Been &amp; <em>What I’ve Learned.</em>
          </h2>
        </Reveal>
        <div style={{ marginTop: 36 }}>
          <div className="journey-canvas" id="cv" ref={canvas}>
            <svg className="journey-wires" id="wires" viewBox={`0 0 ${geo.w} ${geo.h}`}>
              {geo.wires.map((w, i) => (
                <g className={cx('wire', visible[i + 1] && 'is-on')} key={i}>
                  <path d={w.d} />
                  <circle className="wire-node" cx={w.sx} cy={w.sy} r="5" />
                  <circle className="wire-node" cx={w.ex} cy={w.ey} r="5" />
                  {!still && (
                    <circle r="4" fill="var(--accent)">
                      <animateMotion dur="3s" repeatCount="indefinite" path={w.d} />
                    </circle>
                  )}
                </g>
              ))}
            </svg>
            <div
              className="journey-cursor"
              id="cur"
              style={spot ? { transform: `translate(${spot.x}px,${spot.y}px)` } : undefined}
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  d="M5 3l14 7-6 2-2 6z"
                  fill="var(--accent)"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{firstName}</span>
            </div>
            {journey.map((step, i) => (
              <div
                className={cx('frame', i % 2 === 1 && 'frame-offset', visible[i] && 'is-on', current === i && 'is-selected')}
                ref={(el) => {
                  frames.current[i] = el;
                }}
                key={i}
              >
                <span className="frame-label">Frame {String(i + 1).padStart(2, '0')}</span>
                {HANDLES.map((pos, j) => (
                  <i className="frame-handle" style={pos} key={j} />
                ))}
                <div className="frame-body">
                  {step.sticker_text && <span className="frame-sticker">{step.sticker_text}</span>}
                  <div className="frame-period">
                    {step.period}
                    {step.is_current && (
                      <span className="now-tag">
                        <i />
                        Now
                      </span>
                    )}
                  </div>
                  <h3>{step.title}</h3>
                  <small>{step.organization}</small>
                  <p>{step.description}</p>
                  <TagList items={step.tags} />
                </div>
                <span className="frame-dim">Fill × Hug</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
