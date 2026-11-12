import { useContent } from '../../data/useContent.js';
import Reveal from '../../components/Reveal/Reveal.jsx';
import Eyebrow from '../../components/Eyebrow/Eyebrow.jsx';
import TagList from '../../components/TagList/TagList.jsx';
import './Skills.css';

export default function Skills() {
  const { skillLanes, profile } = useContent();

  return (
    <section>
      <div className="wrap">
        <Reveal>
          <Eyebrow>My toolbox</Eyebrow>
          <h2>
            Skills That Shape <em>My Designs.</em>
          </h2>
        </Reveal>
        <Reveal className="skill-lanes" id="lanes">
          {skillLanes.map((lane, i) => (
            <div className="skill-lane" key={i}>
              <div className="lane-number">{lane.number_label}</div>
              <h3>{lane.title}</h3>
              <small>{lane.subtitle}</small>
              <div>
                {(lane.items || []).map((item, j) => (
                  <span className="skill-chip" style={{ '--i': j }} key={j}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
        <Reveal className="skills-extra">
          <div>
            <h3>Soft Skills</h3>
            <TagList items={profile.soft_skills} />
          </div>
          <div>
            <h3>Languages</h3>
            <TagList items={profile.languages} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
