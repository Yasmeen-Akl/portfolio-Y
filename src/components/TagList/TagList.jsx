import './TagList.css';

// Row of small pills (soft skills, languages, journey tags).
export default function TagList({ items }) {
  return (
    <div className="tag-list">
      {(items || []).map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  );
}
