import { useContent } from '../../data/useContent.js';
import Reveal from '../../components/Reveal/Reveal.jsx';
import CountUp from '../../components/CountUp/CountUp.jsx';
import './Stats.css';

const ICONS = {
  devices: (
    <svg viewBox="0 0 54 54">
      <rect className="icon-bob" x="8" y="12" width="20" height="34" rx="5" />
      <rect className="icon-bob icon-bob-late" x="26" y="6" width="20" height="34" rx="5" />
    </svg>
  ),
  ring: (
    <svg viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="21" style={{ stroke: 'var(--line)' }} />
      <circle className="ring-arc" cx="27" cy="27" r="21" pathLength="100" transform="rotate(-90 27 27)" />
    </svg>
  ),
  swatches: (
    <svg className="icon-swatches" viewBox="0 0 54 54">
      <circle cx="19" cy="14" r="8" />
      <circle cx="35" cy="14" r="8" style={{ '--d': '.3s' }} />
      <circle cx="19" cy="30" r="8" style={{ '--d': '.6s' }} />
      <circle cx="35" cy="30" r="8" style={{ '--d': '.9s' }} />
      <circle cx="19" cy="46" r="8" style={{ '--d': '1.2s' }} />
    </svg>
  ),
  network: (
    <svg className="icon-network" viewBox="0 0 54 54">
      <path d="M10 14L27 27 10 40 M27 27L44 14 M27 27L44 40" />
      <circle cx="10" cy="14" r="4" />
      <circle cx="10" cy="40" r="4" />
      <circle cx="44" cy="14" r="4" />
      <circle cx="44" cy="40" r="4" />
      <circle className="network-core" cx="27" cy="27" r="5" />
    </svg>
  ),
};

// A stat is either an animated number ("120" + "h") or a plain word ("Figma").
export function StatValue({ stat }) {
  if (stat.value_number == null) {
    return (
      <b>{`${stat.value_text || ''}${stat.suffix || ''}`}</b>
    );
  }
  return (
    <b>
      <CountUp value={Number(stat.value_number)} />
      {stat.suffix}
    </b>
  );
}

export default function Stats() {
  const { stats } = useContent();
  const strip = stats.filter((s) => s.placement === 'strip');

  return (
    <Reveal className="wrap">
      <div className="stats-strip">
        {strip.map((stat, i) => (
          <div className="stat-card" key={i}>
            {ICONS[stat.icon]}
            <div>
              <StatValue stat={stat} />
              <small>{stat.label}</small>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
