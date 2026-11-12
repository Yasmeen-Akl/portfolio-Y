import { useContent } from '../../data/useContent.js';
import Reveal from '../../components/Reveal/Reveal.jsx';
import Eyebrow from '../../components/Eyebrow/Eyebrow.jsx';
import './Education.css';

// Reveal stagger of the original grid: the card beside the featured one waits .1s,
// then each row of three goes .05s / .15s / .25s.
const delay = (i) => (i === 0 ? '.1s' : ['.05s', '.15s', '.25s'][(i - 1) % 3]);

function FeaturedCard({ item }) {
  return (
    <Reveal className="edu-card featured">
      <div className="edu-ring">
        <svg className="edu-ring-dash" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" />
        </svg>
        <svg className="edu-ring-cap" viewBox="0 0 24 24">
          <path d="M2 9l10-5 10 5-10 5z M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5 M22 9v6" />
        </svg>
      </div>
      <div>
        {item.status_label && (
          <span className="edu-live">
            {item.is_current && <i />}
            {item.status_label}
          </span>
        )}
        <Eyebrow style={{ margin: 0 }}>{item.badge}</Eyebrow>
        <h3>{item.title}</h3>
        {item.institution && <small>{item.institution}</small>}
        {item.details && <p>{item.details}</p>}
      </div>
    </Reveal>
  );
}

function Card({ item, index }) {
  return (
    <Reveal className="edu-card" style={{ '--d': delay(index) }}>
      <Eyebrow>{item.badge}</Eyebrow>
      <h3>{item.title}</h3>
      {item.institution && <small>{item.institution}</small>}
      {item.details && <small>{item.details}</small>}
      {item.status_label && (
        <div className="edu-check">
          <svg viewBox="0 0 24 24">
            <path d="M4 12l5 5L20 6" />
          </svg>
          {item.status_label}
        </div>
      )}
    </Reveal>
  );
}

export default function Education() {
  const { education } = useContent();
  let regular = 0;

  return (
    <section>
      <div className="wrap">
        <Reveal>
          <Eyebrow>Academic background</Eyebrow>
          <h2>
            Education &amp; <em>Certifications.</em>
          </h2>
        </Reveal>
        <div style={{ marginTop: 36 }}>
          <div className="edu-grid">
            {education.map((item, i) =>
              item.is_featured ? (
                <FeaturedCard item={item} key={i} />
              ) : (
                <Card item={item} index={regular++} key={i} />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
