import { useContent } from '../../data/useContent.js';
import Reveal from '../../components/Reveal/Reveal.jsx';
import Eyebrow from '../../components/Eyebrow/Eyebrow.jsx';
import { StatValue } from '../Stats/Stats.jsx';
import { withAccent, withMarks } from '../../lib/richText.jsx';
import './About.css';

export default function About() {
  const { profile, stats } = useContent();
  const [lead, ...rest] = profile.about_paragraphs || [];
  const notes = stats.filter((s) => s.placement === 'about');

  return (
    <section id="about">
      <div className="wrap about-grid">
        <Reveal className="reveal-left">
          <Eyebrow>Who I am</Eyebrow>
          <h2>{withAccent(profile.about_heading)}</h2>
          <div className="polaroid">
            <span className="polaroid-tape" />
            {profile.about_photo_url ? (
              <div className="polaroid-photo has-photo">
                <img src={profile.about_photo_url} alt="" />
              </div>
            ) : (
              <div className="polaroid-photo">
                <span className="scan-line" />
                Upload a photo
                <br />
                (workspace / detail)
              </div>
            )}
            <span className="polaroid-caption">{profile.about_photo_caption}</span>
          </div>
        </Reveal>
        <Reveal style={{ '--d': '.15s' }}>
          {lead != null && <p className="about-lead">{withMarks(lead)}</p>}
          {rest.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          <div className="about-notes">
            {notes.map((stat, i) => (
              <div className="note-card" key={i}>
                <StatValue stat={stat} />
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
