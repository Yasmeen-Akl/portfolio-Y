import { useContent } from '../../data/useContent.js';
import Reveal from '../../components/Reveal/Reveal.jsx';
import Eyebrow from '../../components/Eyebrow/Eyebrow.jsx';
import './Projects.css';

const CARD_COLORS = ['var(--blue)', 'var(--tint)'];

// The three phones lean toward the pointer.
const tilt = {
  onPointerMove(e) {
    const st = e.currentTarget;
    const r = st.getBoundingClientRect();
    st.style.setProperty('--rx', ((e.clientX - r.left) / r.width - 0.5) * 2);
    st.style.setProperty('--ry', ((e.clientY - r.top) / r.height - 0.5) * 2);
  },
  onPointerLeave(e) {
    e.currentTarget.style.setProperty('--rx', 0);
    e.currentTarget.style.setProperty('--ry', 0);
  },
};

function Phone({ src, alt }) {
  return (
    <div className="project-phone">
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="skeleton">
          <i />
          <i />
          <i style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const { projects } = useContent();

  return (
    <section id="work">
      <div className="wrap">
        <Reveal>
          <Eyebrow>Featured work</Eyebrow>
          <h2>
            Selected <em>Projects.</em>
          </h2>
          <p style={{ margin: '10px 0 36px' }}>
            A collection of ideas, challenges, and digital experiences I’ve brought to life.
          </p>
        </Reveal>
        <div className="project-deck">
          {projects.map((project, i) => {
            const link = project.case_study_url
              ? { href: project.case_study_url, target: '_blank', rel: 'noreferrer' }
              : { href: '#' };
            return (
              <article className="project-card" style={{ '--pc': CARD_COLORS[i % 2], '--i': i }} key={i}>
                <div className="project-info">
                  <span className="project-number">{String(i + 1).padStart(2, '0')}</span>
                  <span className="project-tag">{project.tag}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <a className="btn" {...link}>
                    View Case Study →
                  </a>
                </div>
                <div className="project-stage" {...tilt}>
                  <div className="project-phones">
                    {[0, 1, 2].map((j) => (
                      <Phone
                        src={project.screen_urls?.[j]}
                        alt={`${project.title} screen ${j + 1}`}
                        key={j}
                      />
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
