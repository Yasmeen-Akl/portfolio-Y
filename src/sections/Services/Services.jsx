import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../data/useContent.js';
import Reveal from '../../components/Reveal/Reveal.jsx';
import Eyebrow from '../../components/Eyebrow/Eyebrow.jsx';
import './Services.css';

export default function Services() {
  const { serviceGroups, services } = useContent();
  const [tab, setTab] = useState(0);
  const active = Math.min(tab, Math.max(serviceGroups.length - 1, 0));
  const group = serviceGroups[active];
  const inGroup = (g) => services.filter((s) => s.group_id === g.id);

  // On mobile the tab row scrolls sideways. It stays where the visitor left it; the selected
  // tab is only nudged into view when part of it is cut off by the row's edges.
  const tabs = useRef(null);
  useEffect(() => {
    const row = tabs.current;
    const tabEl = row?.children[active];
    if (!tabEl) return;
    const rowBox = row.getBoundingClientRect();
    const tabBox = tabEl.getBoundingClientRect();
    if (tabBox.left < rowBox.left - 1 || tabBox.right > rowBox.right + 1) {
      tabEl.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  }, [active]);

  return (
    <section id="services">
      <div className="wrap">
        <Reveal>
          <Eyebrow>Services</Eyebrow>
          <h2>
            How I Can <em>Help You.</em>
          </h2>
        </Reveal>
        <div className="services" id="sv">
          <div className="services-side reveal is-in">
            <p>{`${services.length} services, grouped by what you need to get done.`}</p>
            <div className="services-tabs" role="tablist" ref={tabs}>
              {serviceGroups.map((g, i) => (
                <button
                  type="button"
                  className="services-tab"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setTab(i)}
                  key={i}
                >
                  <span>{g.name}</span>
                  <small>{inGroup(g).length}</small>
                </button>
              ))}
            </div>
          </div>
          {group && (
            // Keyed by tab so the panel remounts and its fade-in replays on every switch.
            <div className="services-panel" role="tabpanel" key={active}>
              <div className="services-lead">{group.lead}</div>
              <ul className="services-list">
                {inGroup(group).map((s, i) => (
                  <li className="services-item" key={i}>
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Reveal className="services-cta">
          <span>Not sure what you need?</span>
          <a className="btn btn-primary" href="#contact">
            Let’s talk →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
